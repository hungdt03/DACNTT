using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Comment.Validators;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Comment.Commands
{
    [FileOrContentRequired]
    public class CreateCommentCommand : IRequest<BaseResponse>
    {
        public string? Content { get; set; }
        public IFormFile? File { get; set; }
        [Required(ErrorMessage = "ID bài post không được để trống")]
        public Guid PostId { get; set; }
        public Guid? ParentCommentId { get; set; }
        public string? ReplyToUserId { get; set; }
        public string? ReplyToUserName { get; set; }
        public DateTimeOffset SentAt { get; set; }
    }
}
