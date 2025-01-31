

using MediatR;
using SocialNetwork.Application.Common.Attributes;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class InviteFriendsCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp ID của nhóm")]
        public Guid GroupId { get; set; }
        [MinItems(1)]
        public List<string> InviteeIds { get; set; }
    }
}
