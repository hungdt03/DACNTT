using MediatR;
using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Otp.Commands
{
    public class ResendOtpAccountCommand : IRequest<BaseResponse>
    {
        public string Email { get; set; }
    }
}
