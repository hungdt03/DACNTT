
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllSharesByPostIdQuery : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllSharesByPostIdQuery(Guid postId, int page, int size)
        {
            PostId = postId;
            Page = page;
            Size = size;
        }
    }
}
