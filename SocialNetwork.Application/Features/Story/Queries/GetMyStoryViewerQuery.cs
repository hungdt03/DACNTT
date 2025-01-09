
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Story.Queries
{
    public class GetMyStoryViewerQuery : IRequest<BaseResponse>
    {
        public Guid StoryId { get; set; }

        public GetMyStoryViewerQuery(Guid storyId)
        {
            StoryId = storyId;
        }
    }
}
