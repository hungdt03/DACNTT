
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetRoleInvitationByGroupIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public GetRoleInvitationByGroupIdQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
