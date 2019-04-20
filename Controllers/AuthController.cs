using Microsoft.AspNetCore.Mvc;
using Cashier.API.Data;
using System.Threading.Tasks;
using Cashier.API.Models;
using Cashier.API.Dtos;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Cors;
using Microsoft.Data.Sqlite;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Stripe;
using Microsoft.Extensions.Options;
using System.Runtime.Serialization.Json;

namespace Cashier.API.Controllers
{
    [Route("api/[controller]")] // enforces attribute routing
    [ApiController] // automatically validates our requests
    public class AuthController : Controller
    {
        private readonly IConfiguration _config;

        private readonly IAuthRepository _repo;

        private readonly IMapper _mapper;
        private readonly DataContext _context;
        public AuthController(IAuthRepository repo, IConfiguration config, DataContext context, IMapper mapper)
        {
            this._config = config;
            _mapper = mapper;
            _repo = repo;
            _context = context;
        }

        [HttpGet("getRole/{name}")]
        public async Task<IActionResult> getRoleAsync(string name)
        {
            var value = await _context.Users.FirstOrDefaultAsync(x => x.Username == name);
            if (value.Role.ToString().ToUpper() == "ADMIN")
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegister)
        {
            userForRegister.Username = userForRegister.Username.ToLower();
            if (await _repo.UserExists(userForRegister.Username))
            {
                return BadRequest("Username already exists");
            }

            var userToCreate = new User
            {
                Username = userForRegister.Username,
                Created = DateTime.Now,
                Role = userForRegister.Role
            };

            var createdUser = await _repo.Register(userToCreate, userForRegister.Password);

            return StatusCode(201);
        }

        [HttpPost("addItem")]
        public async Task<IActionResult> AddItem(ItemForAddDto prodForAddDto)
        {
            if (prodForAddDto.Price == 0)
            {
                return BadRequest("Price cannot be 0");
            }

            if (await _repo.ItemExists(prodForAddDto.Name))
            {
                return BadRequest("Item already exists");
            }        

            var itemToAdd = new Models.Product
            {
                Name = prodForAddDto.Name,
                Price = prodForAddDto.Price,
                Quantity = prodForAddDto.Quantity,
                Photo = prodForAddDto.Photo,
                Barcode = prodForAddDto.Barcode
            };

            var createdProd = await _repo.AddItem(itemToAdd);

            return StatusCode(201);
        }

        [HttpPut("updateItem")]
        public async Task<IActionResult> updateItem(ItemForUpdate prodForUpdate)
        {
            //var itemId =  await _repo.GetItemId(prodForUpdate.Name);
            try
            {

                var itemFromRepo = await _repo.GetItem(prodForUpdate.Id);
                if (prodForUpdate.Barcode.ToString().Length == 0 ) {
                    prodForUpdate.Barcode = itemFromRepo.Barcode;
                }
                if (prodForUpdate.Photo == null || prodForUpdate.Photo == "") {
                    prodForUpdate.Photo = itemFromRepo.Photo;
                }
                if (prodForUpdate.Quantity.ToString().Length == 0 ) {
                    prodForUpdate.Quantity = itemFromRepo.Quantity;
                }
                if (prodForUpdate.Price.ToString().Length == 0 ) {
                    prodForUpdate.Price = itemFromRepo.Price;
                }                    
                _mapper.Map(prodForUpdate, itemFromRepo);

                if (await _repo.SaveAll())
                {
                    return NoContent();
                }
            }
            catch (Exception e)
            {
               return BadRequest(e.Message);
            }
            return Ok();
        }

        [HttpDelete("DeleteItem/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var itemFromRepo = await _repo.GetItem(id);

            _context.Products.Remove(itemFromRepo);
            await _context.SaveChangesAsync();

            return Ok("Deleted");
        }

        [HttpDelete("DeleteTransaction/{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transactionToRemove = await _repo.getTransaction(id);

            _context.Transactions.Remove(transactionToRemove);
            await _context.SaveChangesAsync();

            return Ok("Deleted");

        }

        [HttpDelete("deleteUser/{id}")]
        public async Task<IActionResult> deleteUser(int id)
        {
            var userFromRepo = await _repo.GetUser(id);

            _context.Users.Remove(userFromRepo);
            await _context.SaveChangesAsync();

            return Ok(true);
        }

        [HttpPost("GetItemId")]
        public async Task<IActionResult> GetItemId(ItemForAddDto item)
        {
            var itemFromRepo = await _repo.GetItemId(item.Name);

            return Ok(itemFromRepo);
        }

        [HttpPost("RemoveItem")]
        public async Task<IActionResult> RemoveItem(ItemForAddDto prodForRemove)
        {

            var itemToAdd = new Models.Product
            {
                Name = prodForRemove.Name,
                Price = prodForRemove.Price,
                Quantity = prodForRemove.Quantity,
                Photo = prodForRemove.Photo,
                Barcode = prodForRemove.Barcode
            };

            var createdProd = await _repo.RemoveItem(itemToAdd);
            return StatusCode(201);
        }

        [HttpPost("purchaseBasket")]
        public IActionResult PurchaseBasket([FromBody]List<Models.Product> basket)
        {
            string items = "";
            double basketprice = 0;
            Transaction transaction = new Transaction();/* */
            foreach (Models.Product item in basket)
            {
                items += item.Name + ",";
                //itemQty += "," + item.Quantity.ToString();
                basketprice += item.Price;
            }
            
            items = items.Substring(0, items.Length-1);
            //itemQty.Substring(itemQty.Length-1);
            transaction.Items = items;
            transaction.TotalPrice = basketprice;
            transaction.date = DateTime.Now.ToString("dd-MM-yyyy");
            transaction.time = DateTime.Now.ToString("hh:mm");            
            
            _repo.AddTransaction(transaction);
            
            foreach (Models.Product item in basket)
            {
                _repo.reduceItem(item);
            }

            if (basket.Count == 0)
            {
                return Unauthorized();
            }


            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {

            var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                    new Claim(ClaimTypes.NameIdentifier, userFromRepo.id.ToString()),
                    new Claim(ClaimTypes.Name, userFromRepo.Username)
                };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            userFromRepo.LastActive = DateTime.Now;

            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }

        [HttpPost("Charge")]
        public JsonResult Post([FromBody]StripePaymentRequest paymentRequest)
        {
            StripeConfiguration.SetApiKey("sk_test_o7S4sNQHxLHvhuWAor7cV6jc");

            var myCharge = new ChargeCreateOptions();
            myCharge.SourceId = paymentRequest.tokenId;
            myCharge.Amount = paymentRequest.amount;
            myCharge.Currency = "eur";
            myCharge.Description = paymentRequest.productName;
            myCharge.Metadata = new Dictionary<string, string>();
            myCharge.Metadata["OurRef"] = "OurRef-" + Guid.NewGuid().ToString();

            var chargeService = new ChargeService();
            Charge stripeCharge = chargeService.Create(myCharge);

            return Json(stripeCharge);
        }

        public class StripePaymentRequest
        {
            public string tokenId { get; set; }
            public string productName { get; set; }
            public int amount { get; set; }
        }
    }
}

