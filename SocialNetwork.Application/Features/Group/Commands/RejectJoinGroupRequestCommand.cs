
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class RejectJoinGroupRequestCommand : IRequest<BaseResponse>
    {
        public Guid RequestId { get; set; }

        public RejectJoinGroupRequestCommand(Guid requestId)
        {
            RequestId = requestId;
        }
    }
}
