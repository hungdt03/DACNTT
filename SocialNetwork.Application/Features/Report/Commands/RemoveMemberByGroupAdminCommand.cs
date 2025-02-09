
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Report.Commands
{
    public class RemoveMemberByGroupAdminCommand : IRequest<BaseResponse>
    {
        public Guid ReportId { get; set; }

        public RemoveMemberByGroupAdminCommand(Guid reportId)
        {
            ReportId = reportId;
        }
    }
}
