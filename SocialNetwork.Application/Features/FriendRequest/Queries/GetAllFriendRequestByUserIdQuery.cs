

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.FriendRequest.Queries
{
    public class GetAllFriendRequestByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }
        public int Page {  get; set; }
        public int Size {  get; set; }

        public GetAllFriendRequestByUserIdQuery(string userId, int page, int size)
        {
            UserId = userId;
            Page = page;
            Size = size;
        }
    }
}
