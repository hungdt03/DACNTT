
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.FriendRequest.Queries
{
    public class GetFriendSuggestionsQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetFriendSuggestionsQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
