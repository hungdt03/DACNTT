using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class CancelInviteFriendCommand : IRequest<BaseResponse>
    {
        public Guid InviteId { get; set; }

        public CancelInviteFriendCommand(Guid inviteId)
        {
            InviteId = inviteId;
        }
    }
}
