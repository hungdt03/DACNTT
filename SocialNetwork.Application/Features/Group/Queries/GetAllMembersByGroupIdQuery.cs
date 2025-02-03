

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetAllMembersByGroupIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public GetAllMembersByGroupIdQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
