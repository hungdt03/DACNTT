using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.Auth.Commands;
using SocialNetwork.Application.Features.Auth.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IMediator mediator;
        public AdminController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("admin-users")]
        public async Task<IActionResult> GetALlUsers()
        {
            return Ok();
        }

        [HttpPost("admin-posts")]
        public async Task<IActionResult> GetALlPosts()
        {
            return Ok();
        }

        [HttpGet("admin-statistical")]
        public async Task<IActionResult> GetStatistical()
        {
            return Ok();
        }

    }
}
