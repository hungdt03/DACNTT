using MediatR;
using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.ChatRoom.Commands
{
    public class LeaveChatRoomCommand : IRequest<BaseResponse>
    {
        public Guid ChatRoomId { get; set; }

        public LeaveChatRoomCommand(Guid chatRoomId)
        {
            ChatRoomId = chatRoomId;
        }
    }
}
