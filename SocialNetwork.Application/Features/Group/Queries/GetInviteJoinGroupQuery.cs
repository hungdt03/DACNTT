
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetInviteJoinGroupQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public GetInviteJoinGroupQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
