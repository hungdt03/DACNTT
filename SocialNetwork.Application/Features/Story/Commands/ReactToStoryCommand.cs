using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Story.Commands
{
    public class ReactToStoryCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID story không được để trống")]
        public Guid StoryId { get; set; }

        [Required(ErrorMessage = "Cảm xúc về tin không được để trống")]
        public string ReactionType { get; set; }
    }
}
