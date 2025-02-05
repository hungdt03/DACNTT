
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class CancelRoleInvitationCommand : IRequest<BaseResponse>
    {
        public Guid MemberId { get; set; }

        public CancelRoleInvitationCommand(Guid memberId)
        {
            MemberId = memberId;
        }
    }
}
