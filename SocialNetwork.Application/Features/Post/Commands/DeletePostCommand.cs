

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Commands
{
    public class DeletePostCommand : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }

        public DeletePostCommand(Guid postId)
        {
            PostId = postId;
        }
    }
}
