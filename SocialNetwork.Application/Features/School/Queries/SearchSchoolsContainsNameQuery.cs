
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.School.Queries
{
    public class SearchSchoolsContainsNameQuery : IRequest<BaseResponse>
    {
        public string Name { get; set; }

        public SearchSchoolsContainsNameQuery(string name)
        {
            Name = name;
        }
    }
}
