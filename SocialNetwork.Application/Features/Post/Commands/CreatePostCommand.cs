using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;


namespace SocialNetwork.Application.Features.Post.Commands
{
    public class CreatePostCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }
    }
}
