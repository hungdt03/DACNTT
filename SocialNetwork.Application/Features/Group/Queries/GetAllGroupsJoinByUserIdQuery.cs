

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetAllGroupsJoinByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetAllGroupsJoinByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
