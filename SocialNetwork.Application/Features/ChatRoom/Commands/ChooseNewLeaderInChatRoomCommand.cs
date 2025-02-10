
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.ChatRoom.Commands
{
    public class ChooseNewLeaderInChatRoomCommand : IRequest<BaseResponse>
    {
        public Guid MemberId { get; set; }

        public ChooseNewLeaderInChatRoomCommand(Guid memberId)
        {
            MemberId = memberId;
        }
    }
}
