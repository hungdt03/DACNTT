

using MediatR;

using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetTopSixMutualFriendsQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetTopSixMutualFriendsQuery(string userId)
        {
            UserId = userId;
        }
    }
}
