

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.SavedPost.Commands
{
    public class RemoveSavedPostCommand : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }

        public RemoveSavedPostCommand(Guid postId)
        {
            PostId = postId;
        }
    }
}
