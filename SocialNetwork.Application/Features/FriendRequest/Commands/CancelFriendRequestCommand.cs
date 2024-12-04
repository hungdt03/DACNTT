

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.FriendRequest.Commands
{
    public class CancelFriendRequestCommand : IRequest<BaseResponse>
    {
        public Guid RequestId { get; set; }

        public CancelFriendRequestCommand(Guid requestId)
        {
            RequestId = requestId;
        }
    }
}
