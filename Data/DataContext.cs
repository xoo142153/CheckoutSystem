using Microsoft.EntityFrameworkCore;
using Cashier.API.Models;

namespace Cashier.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}

        public DbSet<Product> Products { get; set;}
    }
}