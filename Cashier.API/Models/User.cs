using System;

namespace Cashier.API.Models
{
    public class User
    {
        public int id{get;set;}
        public string Username {get;set;}
        public byte[] PasswordHash {get;set;}
        public byte[] PasswordSalt {get;set;}
        public DateTime LastActive {get;set;}
        public DateTime Created {get;set;}
        public string PhoneNumber {get;set;}
        public string Role {get;set;}
    }
}