

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetAllFriendsByFullNameQuery : IRequest<BaseResponse>
    {
        public GetAllFriendsByFullNameQuery(string fullName)
        {
            FullName = fullName;
        }

        public string FullName { get; set; }
    }
}
