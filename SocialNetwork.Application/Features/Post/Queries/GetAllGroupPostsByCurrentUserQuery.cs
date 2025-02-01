

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllGroupPostsByCurrentUserQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllGroupPostsByCurrentUserQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
