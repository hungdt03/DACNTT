

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class AcceptInviteFriendCommand : IRequest<BaseResponse>
    {
        public Guid InviteId { get; set; }

        public AcceptInviteFriendCommand(Guid inviteId)
        {
            InviteId = inviteId;
        }
    }
}
