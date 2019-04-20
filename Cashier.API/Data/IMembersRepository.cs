using System.Collections.Generic;
using System.Threading.Tasks;
using Cashier.API.Models;

namespace Cashier.API.Data
{
    public interface IMembersRepository
    {
         void Add<T>(T entity) where T: class;
         void Delete<T>(T entity) where T: class;
         Task<bool> SaveAll();
         Task<IEnumerable<User>> GetUsers();
         Task<User> GetUser(int id);
    }
}