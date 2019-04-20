using System;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Cashier.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Data.Entity.Migrations;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace Cashier.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private DataContext _context;
        public IConfiguration Configuration { get; }
        public AuthRepository(DataContext context,  IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }
        
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x=>x.Username == username);

            if (user == null)
            {
                return null;
            }

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
            {
                return null;
            }
            
            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt)){
                var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computeHash.Length; i++){
                    if (computeHash[i] != passwordHash[i]) return false;
                }               
            }
            return true;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password,out passwordHash,out passwordSalt);

            user.PasswordHash =  passwordHash;
            user.PasswordSalt =  passwordSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<Product> AddItem(Product prod)
        {
            await _context.Products.AddAsync(prod);
            await _context.SaveChangesAsync();

            return prod;
        }

        public async Task<Transaction> AddTransaction(Transaction t)
        {        
            await _context.Transactions.AddAsync(t);
            await _context.SaveChangesAsync();

            return t;
        }

        public async Task<Product> UpdateItem(Product prod)
        {
            //Product dep = await _context.Products.Where(i => i.Id == prod.Id).FirstOrDefaultAsync();

            
            
            await _context.SaveChangesAsync();

            return prod;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        

        public async Task<Product> GetItem(int id)
        {
            var user = await _context.Products.FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<Product> GetItemId(string name)
        {
            var user = await _context.Products.FirstOrDefaultAsync(u => u.Name == name);
            return user;
        }

        public async Task<Transaction> getTransaction(int id)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id);
            return transaction;
        }

        public async Task<Product> RemoveItem(Product prod)
        {
            Product dep = await _context.Products.Where(i => i.Id == prod.Id).FirstOrDefaultAsync();

            _context.Products.Remove(dep);
            await _context.SaveChangesAsync();

            return prod;
        }

        public async Task<bool> itemAvailability(string prodName) {


            var val = await _context.Products.FirstOrDefaultAsync(x => x.Name == prodName);
            
            if (val.Quantity <= 0) {
                return false;
            }

            return true;
        }

        public async void reduceItem(Product prod)
        {
            string name = prod.Name;
            
            if( await itemAvailability(name) == false ) {
                return;
            }
                   
            using (SqlConnection connection = new SqlConnection(Configuration.GetConnectionString("DefaultConnection")))
                    {

                        SqlCommand command = new SqlCommand( $"update Products set Quantity = Quantity -1 where Name = '{name}'", connection);
                        command.Connection.Open();
                        command.ExecuteNonQuery();
                        command.Connection.Close();
                    }
/* 
            SqlConnection con  = new SqlConnection();
            SqlCommand cmd = new SqlCommand();

            con.ConnectionString = "Data Source=Cashier.db";
            con.Open();

            cmd = new SqlCommand("update Products set Quantity = Quantity -1 where Name = 'test123'", con);
            cmd.ExecuteNonQuery();
*/
            

        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512()){
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }            
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(x => x.Username == username)){
                return true;
            }
            else{
                return false;
            }
        }

        public async Task<bool> ItemExists(string name)
        {
            if(await _context.Products.AnyAsync(x => x.Name  == name)){
                return true;
            }
            else{
                return false;
            }
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.id == id);
            return user;
        }
    }
}