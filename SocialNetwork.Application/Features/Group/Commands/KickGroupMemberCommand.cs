

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class KickGroupMemberCommand : IRequest<BaseResponse>
    {
        public Guid GroupMemberId { get; set; }

        public KickGroupMemberCommand(Guid groupMemberId)
        {
            GroupMemberId = groupMemberId;
        }
    }
}
