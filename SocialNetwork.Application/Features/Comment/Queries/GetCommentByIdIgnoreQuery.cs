

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Comment.Queries
{
    public class GetCommentByIdIgnoreQuery : IRequest<BaseResponse>
    {
        public Guid CommentId { get; set; }

        public GetCommentByIdIgnoreQuery(Guid CommentId)
        {
            this.CommentId = CommentId;
        }
    }
}
