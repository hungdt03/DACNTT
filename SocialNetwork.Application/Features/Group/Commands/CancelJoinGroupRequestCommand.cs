
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class CancelJoinGroupRequestCommand : IRequest<BaseResponse>
    {
        public Guid RequestId { get; set; }

        public CancelJoinGroupRequestCommand(Guid requestId)
        {
            RequestId = requestId;
        }
    }
}
