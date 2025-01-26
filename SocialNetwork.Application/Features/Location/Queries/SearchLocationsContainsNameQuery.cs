
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Location.Queries
{
    public class SearchLocationsContainsNameQuery : IRequest<BaseResponse>
    {
        public string Name { get; set; }

        public SearchLocationsContainsNameQuery(string name)
        {
            Name = name;
        }
    }
}
