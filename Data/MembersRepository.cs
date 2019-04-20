using System.Collections.Generic;
using System.Threading.Tasks;
using Cashier.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Cashier.API.Data
{
    public class MembersRepository : IMembersRepository
    {

        private readonly DataContext _conext;

        public MembersRepository(DataContext context){
            _conext = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _conext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _conext.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _conext.Users.FirstOrDefaultAsync(u => u.id == id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _conext.Users.ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _conext.SaveChangesAsync() > 0;
        }
    }
}