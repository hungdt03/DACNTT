

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetPostByIdQuery : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }

        public GetPostByIdQuery(Guid postId)
        {
            PostId = postId;
        }
    }
}
