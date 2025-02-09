
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetPostVideosByCurrentUserQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetPostVideosByCurrentUserQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
