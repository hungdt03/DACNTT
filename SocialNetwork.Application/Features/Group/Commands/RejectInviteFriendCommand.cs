

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

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
