

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Commands
{
    public class ApprovalPostByGroupIdAndPostIdCommand : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public Guid PostId { get; set; }

        public ApprovalPostByGroupIdAndPostIdCommand(Guid groupId, Guid postId)
        {
            GroupId = groupId;
            PostId = postId;
        }
    }
}
