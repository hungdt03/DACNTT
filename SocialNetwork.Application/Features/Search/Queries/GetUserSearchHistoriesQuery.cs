using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Search.Queries
{
    public class GetUserSearchHistoriesQuery : IRequest<BaseResponse>
    {
        public int Page { get; set; }
        public int Size { get; set; }

        public GetUserSearchHistoriesQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
