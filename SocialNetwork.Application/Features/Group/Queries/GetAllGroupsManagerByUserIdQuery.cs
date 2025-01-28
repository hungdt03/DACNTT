

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetAllGroupsManagerByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetAllGroupsManagerByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
