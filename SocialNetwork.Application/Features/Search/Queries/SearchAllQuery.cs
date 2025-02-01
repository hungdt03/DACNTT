
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Search.Queries
{
    public class SearchAllQuery : IRequest<BaseResponse>
    {
        public string Query { get; set; }

        public SearchAllQuery(string query)
        {
            Query = query;
        }
    }
}
