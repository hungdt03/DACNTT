using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.Auth.Commands;

namespace SocialNetwork.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IMediator mediator;

        public AuthController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] RegisterCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn([FromBody] LoginCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }
    }
}
