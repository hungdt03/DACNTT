using MediatR;
using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Search.Queries
{
    public class SearchUserQuery : IRequest<BaseResponse>
    {
        public string Query { get; set; }

        public SearchUserQuery(string query)
        {
            Query = query;
        }
    }
}
