using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.Auth.Commands;
using SocialNetwork.Application.Features.Auth.Queries;

namespace SocialNetwork.API.Controllers
{
    [Route("api/auth")]
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

        [Authorize]
        [HttpGet("principal")]
        public async Task<IActionResult> GetPrincipal()
        {
            var response = await mediator.Send(new GetPrincipalQuery());
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [Authorize]
        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("change-email")]
        public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }
    }
}
