
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Message.Commands
{
    public class ReadMessageCommand : IRequest<BaseResponse>
    {
        public Guid ChatRoomId { get; set; }

        public ReadMessageCommand(Guid chatRoomId)
        {
            ChatRoomId = chatRoomId;
        }
    }
}
