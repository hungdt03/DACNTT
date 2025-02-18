

using MediatR;
using SocialNetwork.Application.Common.Attributes;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Story.Commands
{
    public class CreateStoryCommand : IRequest<BaseResponse>
    {
        public string Content { get; set; }
        [Required(ErrorMessage = "Background không được để trống")]
        public string Background { get; set; }
        [Required(ErrorMessage = "Loại story không được để trống")]
        public string Type { get; set; } = StoryType.STORY_TEXT;

        [StoryPrivacyValidation]
        public string Privacy { get; set; }
        public string FontFamily { get; set; }

    }
}
