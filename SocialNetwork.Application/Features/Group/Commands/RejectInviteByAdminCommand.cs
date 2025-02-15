using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class RejectInviteByAdminCommand : IRequest<BaseResponse>
    {
        public Guid InviteId { get; set; }

        public RejectInviteByAdminCommand(Guid inviteId)
        {
            InviteId = inviteId;
        }
    }
}
