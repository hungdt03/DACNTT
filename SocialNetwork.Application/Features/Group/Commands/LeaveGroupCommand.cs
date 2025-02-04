

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class LeaveGroupCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp mã nhóm")]
        public Guid GroupId { get; set; }
        public Guid? MemberId { get; set; }
    }
}
