

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetPostImagesByCurrentUserQuery : IRequest<BaseResponse>
    {
        public int Page { get; set; }
        public int Size { get; set; }

        public GetPostImagesByCurrentUserQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
