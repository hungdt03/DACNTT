
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetGroupByIdIgnoreQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public GetGroupByIdIgnoreQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
