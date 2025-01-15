
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Otp.Commands
{
    public class ResendOtpForrgotPasswordCommand : IRequest<BaseResponse>
    {
        public string Email { get; set; }
    }
}
