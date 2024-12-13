

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllPostByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllPostByUserIdQuery(string userId, int page, int size)
        {
            UserId = userId;
            Page = page;
            Size = size;
        }
    }
}
