

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Story.Commands
{
    public class DeleteStoryByIdCommand : IRequest<BaseResponse>
    {
        public Guid StoryId { get; set; }

        public DeleteStoryByIdCommand(Guid storyId)
        {
            StoryId = storyId;
        }
    }
}
