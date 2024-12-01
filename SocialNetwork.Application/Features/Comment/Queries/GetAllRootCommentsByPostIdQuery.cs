

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Comment.Queries
{
    public class GetAllRootCommentsByPostIdQuery : IRequest<BaseResponse>
    {

        public Guid PostId { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }

        public GetAllRootCommentsByPostIdQuery(Guid postId, int page, int size)
        {
            PostId = postId;
            Page = page;
            Size = size;
        }
    }
}
