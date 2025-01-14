

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Comment.Queries
{
    public class GetNextCommentsQuery : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }
        public int Page {  get; set; }
        public Guid? ParentCommentId { get; set; } = null;

        public GetNextCommentsQuery(Guid postId, int page, Guid? parentCommentId)
        {
            PostId = postId;
            Page = page;
            ParentCommentId = parentCommentId;
        }
    }
}
