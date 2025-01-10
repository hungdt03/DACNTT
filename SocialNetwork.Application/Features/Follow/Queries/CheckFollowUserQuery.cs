using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Follow.Queries
{
    public class CheckFollowUserQuery : IRequest<BaseResponse>
    {
        public CheckFollowUserQuery(string followeeId)
        {
            FolloweeId = followeeId;
        }

        public string FolloweeId { get; set; }
    }
}
