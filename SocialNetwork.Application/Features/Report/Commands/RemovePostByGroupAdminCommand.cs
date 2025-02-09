

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Report.Commands
{
    public class RemovePostByGroupAdminCommand : IRequest<BaseResponse>
    {
        public Guid ReportId { get; set; }

        public RemovePostByGroupAdminCommand(Guid reportId)
        {
            ReportId = reportId;
        }
    }
}
