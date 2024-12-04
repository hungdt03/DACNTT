using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Application.Features.User.Queries;

namespace SocialNetwork.API.Controllers
{
    [Authorize]
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator mediator;

        public UserController(IMediator mediator)
        {
            this.mediator = mediator;
        }


        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById([FromRoute] string userId)
        {
            var response = await mediator.Send(new GetUserByIdQuery(userId));
            return Ok(response);
        }

    }
}
