

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetAllFollowersByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public string Search { get; set; }

        public GetAllFollowersByUserIdQuery(string userId, int page, int size, string search)
        {
            UserId = userId;
            Page = page;
            Size = size;
            Search = search;
        }
    }
}
