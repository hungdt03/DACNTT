
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class AcceptInviteByAdminCommand : IRequest<BaseResponse>
    {
        public Guid InviteId { get; set; }

        public AcceptInviteByAdminCommand(Guid inviteId)
        {
            InviteId = inviteId;
        }
    }
}
