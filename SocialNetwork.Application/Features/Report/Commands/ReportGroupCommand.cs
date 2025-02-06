using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Report.Commands
{
    public class ReportGroupCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID nhóm báo cáo không được để trống")]
        public Guid GroupId { get; set; }
        [Required(ErrorMessage = "Vui lòng cho biết lí do tại sao bạn báo cáo nhóm này")]
        public string Reason { get; set; }
    
    }
}
