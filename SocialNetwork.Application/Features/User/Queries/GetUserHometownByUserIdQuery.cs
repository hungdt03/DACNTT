

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetUserHometownByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetUserHometownByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
