

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Commands
{
    public class DeleteFriendCommand : IRequest<BaseResponse>
    {
        public string FriendId { get; set; }

        public DeleteFriendCommand(string friendId)
        {
            FriendId = friendId;
        }
    }
}
