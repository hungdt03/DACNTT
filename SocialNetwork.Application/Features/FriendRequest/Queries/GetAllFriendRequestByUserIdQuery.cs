

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.FriendRequest.Queries
{
    public class GetAllFriendRequestByUserIdQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size {  get; set; }

        public GetAllFriendRequestByUserIdQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
