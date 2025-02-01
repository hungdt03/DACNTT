using MediatR;
using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Search.Queries
{
    public class SearchPostQuery : IRequest<BaseResponse>
    {
        public string Query { get; set; }

        public SearchPostQuery(string query)
        {
            Query = query;
        }
    }
}
