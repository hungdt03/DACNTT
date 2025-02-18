
using MediatR;
using SocialNetwork.Application.Common.Attributes;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Post.Commands
{
    public class ChangePostPrivacyCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID của bài viết không được để trống")]
        public Guid PostId { get; set; }

        [Required(ErrorMessage = "Quyền riêng tư của bài viết không được để trống")]
        [PostPrivacyValidation]
        public string PrivacyType { get; set; }

        public ChangePostPrivacyCommand(Guid postId, string privacyType)
        {
            PostId = postId;
            PrivacyType = privacyType;
        }
    }
}
