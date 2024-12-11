
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.FriendShip.Queries
{
    public class GetFriendRequestByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId {  get; set; }

        public GetFriendRequestByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
