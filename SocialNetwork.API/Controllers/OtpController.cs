using MediatR;
using Microsoft.AspNetCore.Mvc;
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

        [HttpPost("verify-account")]
        public async Task<IActionResult> VerifyOtpAccount([FromBody] VerifyOtpAccountCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPost("verify-forgot-password")]
        public async Task<IActionResult> VerifyOtpForgotPassword([FromBody] VerifyOtpForgotPasswordCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPost("resend-verify-account")]
        public async Task<IActionResult> ResendOtpAccountVerification([FromBody] ResendOtpAccountCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }

        [HttpPost("resend-verify-forgot-password")]
        public async Task<IActionResult> ResendOtpForgotPassword([FromBody] ResendOtpForrgotPasswordCommand command)
        {
            var response = await mediator.Send(command);
            return Ok(response);
        }
    }
}
