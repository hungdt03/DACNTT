
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Report.Commands
{
    public class ReportUserCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID người bị báo cáo không được để trống")]
        public string UserId { get; set; }
        [Required(ErrorMessage = "Vui lòng cho biết lí do tại sao bạn báo cáo người này")]
        public string Reason { get; set; }
        public Guid? GroupId { get; set; }
    }
}
