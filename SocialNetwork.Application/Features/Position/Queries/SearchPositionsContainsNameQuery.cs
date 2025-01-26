using MediatR;
using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Position.Queries
{
    public class SearchPositionsContainsNameQuery : IRequest<BaseResponse>
    {
        public string Name { get; set; }

        public SearchPositionsContainsNameQuery(string name)
        {
            Name = name;
        }
    }
}
