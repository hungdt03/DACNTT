
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Post.Commands
{
    public class CreateSharePostCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID bài viết gốc không được để trống")]
        public Guid OriginalPostId { get; set; }

        [Required(ErrorMessage = "ID bài viết chia sẻ không được để trống")]
        public Guid PostId { get; set; }

        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }
        public string Privacy { get; set; } = PrivacyConstant.PUBLIC;
        public List<string>? TagIds { get; set; }
    }
}
