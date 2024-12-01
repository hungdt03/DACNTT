using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;


namespace SocialNetwork.Application.Features.Post.Commands
{
    public class CreatePostCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }
        public string Privacy { get; set; } = PrivacyConstant.PUBLIC;
        public List<IFormFile>? Images { get; set; }
        public List<IFormFile>? Videos { get; set; }
        public List<string>? TagIds { get; set; }
    }
}
