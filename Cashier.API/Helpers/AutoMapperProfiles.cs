using AutoMapper;
using Cashier.API.Dtos;
using Cashier.API.Models;

namespace Cashier.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>();
            CreateMap<User, UserForDetailedDto>();
            CreateMap<UserForDetailedDto, User>();
            CreateMap<Product, ItemForAddDto>();
            CreateMap<ItemForAddDto, Product>();
        }
        
    }
}