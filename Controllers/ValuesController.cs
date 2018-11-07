using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Cashier.API.Data;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Cashier.API.Controllers
{
    // http://localhost:5000/api/values/
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;
        public ValuesController(DataContext context)
        {
            _context = context;

        }
        // GET api/values
        [HttpGet("getProducts")]
        public async Task<IActionResult> GetProducts()
        {
            var values = await _context.Products.ToListAsync();

            return Ok(values);
        }

        // GET api/values/5
        [HttpGet("getProduct/{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var value = await _context.Products.FirstOrDefaultAsync(x => x.Id == id); //use firstOrDefault incase it doesnt find it, it will return null instead of exception
            return Ok(value);
        }

        // GET price using Basket of ids
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
        [HttpGet("getChange/{cost}/{given}")]
        public ActionResult<double> getChange(double cost, double given){
            double change = cost - given;
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
