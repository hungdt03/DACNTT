

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class RejectInviteFriendCommand : IRequest<BaseResponse>
    {
        public Guid InviteId { get; set; }

        public RejectInviteFriendCommand(Guid inviteId)
        {
            InviteId = inviteId;
        }
    }
}
