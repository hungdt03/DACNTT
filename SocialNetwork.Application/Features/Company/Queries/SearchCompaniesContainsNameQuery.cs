

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Company.Queries
{
    public class SearchCompaniesContainsNameQuery : IRequest<BaseResponse>
    {
        public string Name { get; set; }

        public SearchCompaniesContainsNameQuery(string name)
        {
            Name = name;
        }
    }
}
