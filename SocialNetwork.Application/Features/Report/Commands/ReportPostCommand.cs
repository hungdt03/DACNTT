
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Report.Commands
{
    public class ReportPostCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID bài viết không được để trống")]
        public Guid PostId { get; set; }
        [Required(ErrorMessage = "Vui lòng cung cấp lí do cho chúng tôi biết tại sao bạn báo cáo bài viết này")]
        public string Reason { get; set; }
        public Guid? GroupId { get; set; }
    }
}
