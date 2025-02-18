using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Common.Attributes;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;


namespace SocialNetwork.Application.Features.Post.Commands
{
    public class CreatePostCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }
        [PostPrivacyValidation]
        public string Privacy { get; set; } = PrivacyConstant.PUBLIC;
        public string? Background {  get; set; }
        public Guid? GroupId { get; set; }
        [ImageFile]
        public List<IFormFile>? Images { get; set; }

        [VideoFile]
        public List<IFormFile>? Videos { get; set; }
        public List<string>? TagIds { get; set; }
    }
}
