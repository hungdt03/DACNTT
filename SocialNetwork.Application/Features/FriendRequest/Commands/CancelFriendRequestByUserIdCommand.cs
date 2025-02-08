
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.FriendRequest.Commands
{
    public class CancelFriendRequestByUserIdCommand : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public CancelFriendRequestByUserIdCommand(string userId)
        {
            UserId = userId;
        }
    }
}
