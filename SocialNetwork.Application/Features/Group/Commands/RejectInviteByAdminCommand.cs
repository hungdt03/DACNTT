using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

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
