using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Follow.Queries
{
    public class GetAllFollowerByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetAllFollowerByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
