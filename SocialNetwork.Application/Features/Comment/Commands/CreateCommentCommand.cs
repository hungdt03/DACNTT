using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Comment.Commands
{
    public class CreateCommentCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Nội dung bình luận không được để trống")]
        public string Content { get; set; }
        [Required(ErrorMessage = "ID bài post không được để trống")]
        public Guid PostId { get; set; }
        public Guid? ParentCommentId { get; set; }
        public string? ReplyToUserId { get; set; }
        public string? ReplyToUserName { get; set; }
    }
}
