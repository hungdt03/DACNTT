
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Report.Commands
{
    public class ReportCommentCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID bình luận bị báo cáo không được để trống")]
        public Guid CommentId { get; set; }
        [Required(ErrorMessage = "Vui lòng cho biết lí do tại sao bạn lại báo cáo bình luận này")]
        public string Reason { get; set; }
        public Guid? GroupId { get; set; }
    }
}
