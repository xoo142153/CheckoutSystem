using System.ComponentModel.DataAnnotations;

namespace Cashier.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username {get; set;}
        [Required]
        [StringLength(12, MinimumLength = 6, ErrorMessage = "Passwords can only have a length between 6 and 12.")]
        public string Password {get; set;}
        [Required]
        public string Role{get;set;}
    }
}