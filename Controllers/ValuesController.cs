using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cashier.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Microsoft.AspNetCore.Authorization;

namespace Cashier.API.Controllers
{
    // http://localhost:5000/api/values/
    [Authorize]
    [Route("api/[controller]")] // enforces attribute routing
    [ApiController] // automatically validates our requests
    public class ValuesController : ControllerBase // ControllerBase gives access to HTTP responses and actions such as IActionResult
                                                    // Not using " Controller" as it gives View support. I just need the API so base is fine.
    {
        private readonly DataContext _context;
        public ValuesController(DataContext context)
        {
            _context = context;

        }
        // GET api/values
        [AllowAnonymous]
        [HttpGet("getProducts")]
        public async Task<IActionResult> GetProducts()
        {
            var values = await _context.Products.ToListAsync();

            return Ok(values);
        }

        [AllowAnonymous]
        [HttpGet("filterProducts/{containedString}")]
        public async Task<IActionResult> FilterProducts(string containedString)
        {
            var values = await _context.Products.ToListAsync();
            var filteredValues = values.Where(p => p.Name.ToLower().Contains(containedString.ToLower()));

            return Ok(filteredValues);
        }

        [AllowAnonymous]
        [HttpGet("getTransactions")]
        public async Task<IActionResult> GetTransactions()
        {
            var values = await _context.Transactions.ToListAsync();

            return Ok(values);
        }

        [AllowAnonymous]
        [HttpGet("getUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var values = await _context.Users.ToListAsync();

            return Ok(values);
        }

        // GET api/values/5
        [AllowAnonymous]
        [HttpGet("getProduct/{barcode}")]
        public async Task<IActionResult> GetProduct(int barcode)
        {
            
            /* if( await itemAvailability(id) == false ) {
                return NotFound();
            }*/

            var value = await _context.Products.FirstOrDefaultAsync(x => x.Barcode == barcode); //use firstOrDefault incase it doesnt find it, it will return null instead of exception
            return Ok(value);
        }

        public async Task<int> itemAvailabilityAmount(int prodId) {
            var val = await _context.Products.FirstOrDefaultAsync(x => x.Id == prodId);
            int amt = val.Quantity;

            return amt;
        }

        public async Task<bool> itemAvailability(int prodId) {

            var val = await _context.Products.FirstOrDefaultAsync(x => x.Id == prodId);
            
            if (val.Quantity == 0) {
                return false;
            }
            
            return true;           

        }

        // GET price using Basket of ids        
        [AllowAnonymous]
        [HttpGet("getTotal")] //http://localhost:5000/api/values/getTotal?listofIds=1,2,3
        public async Task<IActionResult> getPrice(string listofIds){
            double price = 0;
            List<int> ids = new List<int>();
            foreach(string number in listofIds.Split(',')){
                ids.Add(int.Parse(number));
            }            
            foreach (int id in ids){
                var item = await _context.Products.FirstOrDefaultAsync(x => x.Id == id);
                price += item.Price;
            }
            return Ok(price);
        }

        // Payment // STILL REQUIRE receipt
        [AllowAnonymous]
        [HttpGet("getChange/{cost}/{given}")]
        public ActionResult<double> getChange(double cost, double given){
            double change = given - cost;
            return change;
        }
        /* 
        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
        */
    }
}
