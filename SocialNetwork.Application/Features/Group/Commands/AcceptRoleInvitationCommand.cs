using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class AcceptRoleInvitationCommand : IRequest<BaseResponse>
    {
        public Guid InvitationId { get; set; }

        public AcceptRoleInvitationCommand(Guid invitationId)
        {
            InvitationId = invitationId;
        }
    }
}
