
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class UpdateUserBasicInfoCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Họ và tên không được để trống")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "Vui lòng chọn giới tính")]
        public string Gender { get; set; }
        public DateTimeOffset Birthday { get; set; }
        [RegularExpression(@"^[0-9]{10,11}$", ErrorMessage = "Số điện thoại không hợp lệ")]
        public string? PhoneNumber { get; set; }
    }
}
