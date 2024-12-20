using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Message.Queries
{
    public class GetAllMessagesByChatRoomQuery : IRequest<BaseResponse>
    {
        public Guid ChatRoomId { get; set; }

        public GetAllMessagesByChatRoomQuery(Guid chatRoomId)
        {
            ChatRoomId = chatRoomId;
        }
    }
}
