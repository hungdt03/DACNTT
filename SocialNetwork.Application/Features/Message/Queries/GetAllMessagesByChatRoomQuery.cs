using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Message.Queries
{
    public class GetAllMessagesByChatRoomQuery : IRequest<BaseResponse>
    {
        public Guid ChatRoomId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllMessagesByChatRoomQuery(Guid chatRoomId, int page, int size)
        {
            ChatRoomId = chatRoomId;
            Page = page;
            Size = size;
        }
    }
}
