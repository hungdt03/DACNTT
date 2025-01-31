
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class ModifyGroupSettingCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp ID nhóm")]
        public Guid GroupId { get; set; }
        public bool IsPostApprovalRequired { get; set; }
        public bool IsMemberApprovalRequired { get; set; }
    }
}
