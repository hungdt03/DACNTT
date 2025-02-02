
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Search.Queries
{
    public class GetAllSearchSuggestQuery : IRequest<BaseResponse>
    {
        public string Query { get; set; }

        public GetAllSearchSuggestQuery(string query)
        {
            Query = query;
        }
    }
}
