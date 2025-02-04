

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class RevokeUserPermissionCommand : IRequest<BaseResponse>
    {
        public Guid MemberId { get; set; }

        public RevokeUserPermissionCommand(Guid memberId)
        {
            MemberId = memberId;
        }
    }
}
