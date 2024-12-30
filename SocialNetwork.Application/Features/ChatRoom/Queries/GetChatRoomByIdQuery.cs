

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.ChatRoom.Queries
{
    public class GetChatRoomByIdQuery : IRequest<BaseResponse>
    {
        public Guid ChatRoomId { get; set; }

        public GetChatRoomByIdQuery(Guid chatRoomId)
        {
            ChatRoomId = chatRoomId;
        }
    }
}
