
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetUserLocationByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetUserLocationByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
