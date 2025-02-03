

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Commands
{
    public class RejectPostByGroupIdAndPostIdCommand : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public Guid PostId { get; set; }

        public RejectPostByGroupIdAndPostIdCommand(Guid groupId, Guid postId)
        {
            GroupId = groupId;
            PostId = postId;
        }
    }
}
