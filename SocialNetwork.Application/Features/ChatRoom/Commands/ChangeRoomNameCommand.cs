

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.ChatRoom.Commands
{
    public class ChangeRoomNameCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Tên nhóm không được để trống")]
        public string Name { get; set; }
        [Required(ErrorMessage = "ID nhóm chat không được để trống")]
        public Guid ChatRoomId { get; set; }
    }
}
