using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Filters;
using SocialNetwork.Application.Features.Otp.Commands;

namespace SocialNetwork.API.Controllers
{
    [Route("api/otps")]
    [ApiController]
    public class OtpController : ControllerBase
    {
        private readonly IMediator mediator;

        public OtpController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("verify-account")]
        public async Task<IActionResult> VerifyOtpAccount([FromBody] VerifyOtpAccountCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("verify-forgot-password")]
        public async Task<IActionResult> VerifyOtpForgotPassword([FromBody] VerifyOtpForgotPasswordCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("resend-verify-account")]
        public async Task<IActionResult> ResendOtpAccountVerification([FromBody] ResendOtpAccountCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("resend-verify-forgot-password")]
        public async Task<IActionResult> ResendOtpForgotPassword([FromBody] ResendOtpForrgotPasswordCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [Authorize]
        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("verify-change-email")]
        public async Task<IActionResult> VerifyOtpChangeEmail([FromBody] VerifyOtpChangeEmailCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [Authorize]
        [ServiceFilter(typeof(InputValidationFilter))]
        [HttpPost("resend-change-email")]
        public async Task<IActionResult> ResendVerifyOtpChangeEmail([FromBody] ResendOtpChangeEmailCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }
    }
}
