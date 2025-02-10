

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.ChatRoom.Commands
{
    public class KickMemberInChatRoomCommand : IRequest<BaseResponse>
    {
        public Guid MemberId { get; set; }

        public KickMemberInChatRoomCommand(Guid memberId)
        {
            MemberId = memberId;
        }
    }
}
