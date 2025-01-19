
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Follow.Queries
{
    public class GetAllFolloweesByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetAllFolloweesByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
