using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Search.Queries
{
    public class SearchGroupQuery : IRequest<BaseResponse>
    {
        public string Query { get; set; }

        public SearchGroupQuery(string query)
        {
            Query = query;
        }
    }
}
