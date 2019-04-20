namespace Cashier.API.Models
{
    public class Product
    {
        
        public int Id { get; set;}
        public string Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public string Photo {get;set;}
        public int Barcode {get;set;}
    }
}