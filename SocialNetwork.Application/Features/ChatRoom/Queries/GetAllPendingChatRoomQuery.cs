

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.ChatRoom.Queries
{
    public class GetAllPendingChatRoomQuery : IRequest<BaseResponse>
    {
    }
}
