using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Otp.Commands
{
    public class VerifyOtpAccountCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Mã OTP không được để trống")]
        public string OtpCode { get; set; }
        [Required(ErrorMessage = "Địa chỉ email không được để trống")]
        public string Email { get; set; }
    }
}
