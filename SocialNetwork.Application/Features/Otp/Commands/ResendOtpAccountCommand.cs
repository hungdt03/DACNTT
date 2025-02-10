using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;


namespace SocialNetwork.Application.Features.Otp.Commands
{
    public class ResendOtpAccountCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Địa chỉ email không được để trống")]
        public string Email { get; set; }
    }
}
