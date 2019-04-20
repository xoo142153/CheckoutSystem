using System.Collections.Generic;
using System.Threading.Tasks;
using Cashier.API.Models;

namespace Cashier.API.Data
{
    public interface IAuthRepository
    {
         Task<Product> AddItem(Product prod);
         Task<Transaction> AddTransaction(Transaction basket);
         Task<Product> UpdateItem(Product prod);
         Task<Product> RemoveItem(Product prod);
         Task<User> Register(User user, string password);
         Task<User> Login(string username, string password);
         Task<bool> UserExists(string username);
         Task<bool> ItemExists(string name);
         void reduceItem(Product prod);
         Task<Product> GetItem(int id);
         Task<Transaction> getTransaction(int id);
         Task<Product> GetItemId(string name);
         Task<bool> SaveAll();
         Task<User> GetUser(int id);
    }
}