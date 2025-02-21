

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class ApprovalJoinGroupRequestCommand : IRequest<BaseResponse>
    {
        public Guid RequestId { get; set; }

        public ApprovalJoinGroupRequestCommand(Guid requestId)
        {
            RequestId = requestId;
        }
    }
}
