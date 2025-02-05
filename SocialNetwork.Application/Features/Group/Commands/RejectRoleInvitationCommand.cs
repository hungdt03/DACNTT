
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class RejectRoleInvitationCommand : IRequest<BaseResponse>
    {
        public Guid InvitationId { get; set; }

        public RejectRoleInvitationCommand(Guid invitationId)
        {
            InvitationId = invitationId;
        }
    }
}
