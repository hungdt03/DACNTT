
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetPendingApprovalsSummaryQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public GetPendingApprovalsSummaryQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
