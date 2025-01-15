

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Otp.Commands
{
    public class VerifyOtpForgotPasswordCommand : IRequest<BaseResponse>
    {
        public string OtpCode { get; set; }
        public string Email { get; set; }
    }
}
