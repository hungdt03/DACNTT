
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetJoinGroupRequestByGroupIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public GetJoinGroupRequestByGroupIdQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
