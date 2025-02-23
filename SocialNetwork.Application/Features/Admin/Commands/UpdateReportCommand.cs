using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Admin.Commands
{
    public class UpdateReportCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp ID của báo cáo")]
        public Guid Id { get; set; }
        public string NewStatus { get; set; }
        //public string NewReportSolution { get; set; }
        //public bool IsDelete { get; set; }
    }
}
