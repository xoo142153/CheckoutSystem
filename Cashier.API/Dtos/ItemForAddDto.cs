using System.ComponentModel.DataAnnotations;

namespace Cashier.API.Dtos
{
    public class ItemForAddDto
    {
        [Required]
        public string Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public string Photo {get;set;}        
        public int Barcode {get;set;}
    }
}