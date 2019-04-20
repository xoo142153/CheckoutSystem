using System;

namespace Cashier.API.Dtos
{
    public class UserForListDto
    {
        public int id{get;set;}
        public string Username {get;set;}
        public DateTime LastActive {get;set;}
        public DateTime Created {get;set;}
        public string PhoneNumber {get;set;}
        public string Role{get;set;}
        
    }
}