using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.Admin.Queries;

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
        [HttpGet("get-all-user")]
        public async Task<IActionResult> GetAllUser()
        {
            var response = await mediator.Send(new GetAllUserQuery());
            return Ok(response);
        }

        [HttpGet("get-all-post")]
        public async Task<IActionResult> GetALlPosts()
        {
            var response = await mediator.Send(new GetAllPostQuery());
            return Ok(response);
        }

        [HttpGet("get-all-group")]
        public async Task<IActionResult> GetAllGroup()
        {
            var response = await mediator.Send(new GetAllGroupQuery());
            return Ok(response);
        }

    }
}
