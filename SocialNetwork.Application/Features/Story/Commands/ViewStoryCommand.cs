
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Story.Commands
{
    public class ViewStoryCommand : IRequest<BaseResponse>
    {
        public ViewStoryCommand(Guid storyId)
        {
            StoryId = storyId;
        }

        public Guid StoryId { get; set; }
    }
}
