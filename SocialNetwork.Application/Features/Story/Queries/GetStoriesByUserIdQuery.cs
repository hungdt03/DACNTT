
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Story.Queries
{
    public class GetStoriesByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetStoriesByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
