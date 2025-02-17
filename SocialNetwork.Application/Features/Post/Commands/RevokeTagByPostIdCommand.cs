

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Commands
{
    public class RevokeTagByPostIdCommand : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }

        public RevokeTagByPostIdCommand(Guid postId)
        {
            PostId = postId;
        }
    }
}
