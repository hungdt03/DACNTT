

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.FriendRequest.Queries
{
    public class GetAllFriendRequestByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetAllFriendRequestByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
