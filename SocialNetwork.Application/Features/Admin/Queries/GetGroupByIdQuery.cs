
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetGroupByIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public GetGroupByIdQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
