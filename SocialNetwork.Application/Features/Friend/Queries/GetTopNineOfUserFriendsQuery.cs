

using MediatR;

using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetTopNineOfUserFriendsQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetTopNineOfUserFriendsQuery(string userId)
        {
            UserId = userId;
        }
    }
}
