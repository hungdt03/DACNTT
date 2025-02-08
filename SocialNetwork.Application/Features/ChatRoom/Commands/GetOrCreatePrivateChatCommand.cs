
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.ChatRoom.Commands
{
    public class GetOrCreatePrivateChatCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID người nhận không được để trống")]
        public string ReceiverId { get; set; }
    }
}
