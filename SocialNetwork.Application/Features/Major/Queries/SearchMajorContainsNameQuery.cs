
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Major.Queries
{
    public class SearchMajorContainsNameQuery : IRequest<BaseResponse>
    {
        public string Name { get; set; }

        public SearchMajorContainsNameQuery(string name)
        {
            Name = name;
        }
    }
}
