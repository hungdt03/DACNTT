
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class ModifyUserEducationCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Tên trường học không được để trống")]
        public string School { get; set; }
        public bool IsGraduated { get; set; }
        public int? StartYear { get; set; }
    }
}
