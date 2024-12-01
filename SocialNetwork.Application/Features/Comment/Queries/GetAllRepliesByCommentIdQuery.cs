

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Comment.Queries
{
    public class GetAllRepliesByCommentIdQuery : IRequest<BaseResponse>
    {
        public Guid CommentId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllRepliesByCommentIdQuery(Guid commentId, int page, int size)
        {
            CommentId = commentId;
            Page = page;
            Size = size;
        }
    }
}
