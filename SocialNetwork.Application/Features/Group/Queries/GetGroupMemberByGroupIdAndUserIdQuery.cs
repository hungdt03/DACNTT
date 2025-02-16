using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetGroupMemberByGroupIdAndUserIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public string UserId { get; set; }

        public GetGroupMemberByGroupIdAndUserIdQuery(Guid groupId, string userId)
        {
            GroupId = groupId;
            UserId = userId;
        }
    }
}
