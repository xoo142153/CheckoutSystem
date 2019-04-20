using System;
using System.Collections.Generic;

namespace Cashier.API.Models
{
    public class Transaction
    {
        public int Id {get;set;}
        public string Items {get;set;}
        //public string ItemQty {get;set;}
        public double TotalPrice {get;set;}
        public string date {get;set;}
        public string time {get;set;}
    }
}