
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.ChatRoom.Queries
{
    public class GetMediasByChatRoomIdQuery : IRequest<BaseResponse>
    {
        public Guid ChatRoomId { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }

        public GetMediasByChatRoomIdQuery(Guid chatRoomId, int page, int size)
        {
            ChatRoomId = chatRoomId;
            Page = page;
            Size = size;
        }
    }
}
