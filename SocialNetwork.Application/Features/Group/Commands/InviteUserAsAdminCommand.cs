using MediatR;
using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Group.Commands
{
    public class InviteUserAsAdminCommand : IRequest<BaseResponse>
    {
        public Guid MemberId { get; set; }

        public InviteUserAsAdminCommand(Guid memberId)
        {
            MemberId = memberId;
        }
    }
}
