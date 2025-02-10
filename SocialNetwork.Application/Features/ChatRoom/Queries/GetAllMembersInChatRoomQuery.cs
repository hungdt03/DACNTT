

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.ChatRoom.Queries
{
    public class GetAllMembersInChatRoomQuery : IRequest<BaseResponse>
    {
        public Guid ChatRoomId { get; set; }

        public GetAllMembersInChatRoomQuery(Guid chatRoomId)
        {
            ChatRoomId = chatRoomId;
        }
    }
}
