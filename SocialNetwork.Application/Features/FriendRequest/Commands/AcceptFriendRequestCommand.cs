
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.FriendShip.Commands
{
    public class AcceptFriendRequestCommand : IRequest<BaseResponse>
    {
        public Guid RequestId { get; set; }

        public AcceptFriendRequestCommand(Guid requestId)
        {
            RequestId = requestId;
        }
    }
}
