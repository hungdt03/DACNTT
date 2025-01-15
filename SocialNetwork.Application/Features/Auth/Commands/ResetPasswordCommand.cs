
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Auth.Commands
{
    public class ResetPasswordCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp reset password token")]
        public string ResetPasswordToken { get; set; }

        [Required(ErrorMessage = "Vui lòng cung cấp mật khẩu mới")]
        public string NewPassword {  get; set; }
        [Required(ErrorMessage = "Vui lòng cung cấp địa chỉ email")]
        [EmailAddress(ErrorMessage = "Địa chỉ email không đúng định dạng")]
        public string Email { get; set; }
    }
}
