
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Report.Commands
{
    public class RemoveCommentByGroupAdminCommand : IRequest<BaseResponse>
    {
        public Guid ReportId { get; set; }

        public RemoveCommentByGroupAdminCommand(Guid reportId)
        {
            ReportId = reportId;
        }
    }
}
