

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class InviteUserAsModeratorCommand : IRequest<BaseResponse>
    {
        public Guid MemberId { get; set; }

        public InviteUserAsModeratorCommand(Guid memberId)
        {
            MemberId = memberId;
        }
    }
}
