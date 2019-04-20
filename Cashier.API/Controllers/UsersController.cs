using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Cashier.API.Data;
using Cashier.API.Dtos;
using Cashier.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cashier.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMembersRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IMembersRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await  _repo.GetUsers();
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);

            return Ok(usersToReturn);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser( int id, UserForDetailedDto userForUpdateDto) {
            
            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdateDto, userFromRepo);            

            if(await _repo.SaveAll())
            {
                return NoContent();
            }
                
            
            throw new Exception($"Updating user {id} failed on save.");
        }
    }
}