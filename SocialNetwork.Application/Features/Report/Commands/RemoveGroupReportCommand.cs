

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Report.Commands
{
    public class RemoveGroupReportCommand : IRequest<BaseResponse>
    {
        public Guid ReportId { get; set; }

        public RemoveGroupReportCommand(Guid reportId)
        {
            ReportId = reportId;
        }
    }
}
