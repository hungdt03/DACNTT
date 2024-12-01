using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Auth.Commands
{
    public class RegisterCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Địa chỉ email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        public string Password { get; set; }
    }
}
