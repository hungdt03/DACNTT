

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Report.Queries
{
    public class GetReportIgnoreByIdQuery : IRequest<BaseResponse>
    {
        public Guid ReportId { get; set; }

        public GetReportIgnoreByIdQuery(Guid reportId)
        {
            ReportId = reportId;
        }
    }
}
