

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Comment.Queries
{
    public class GetNearbyCommentsByCommentIdQuery : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }
        public Guid CommentId { get; set; }

        public GetNearbyCommentsByCommentIdQuery(Guid postId, Guid commentId)
        {
            CommentId = commentId;
            PostId = postId;
        }
    }
}
