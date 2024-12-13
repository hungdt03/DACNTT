
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetAllFriendsFullInfoQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetAllFriendsFullInfoQuery(string userId)
        {
            UserId = userId;
        }
    }
}
