

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.ChatRoom.Commands
{
    public class AddMembersToChatRoomCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Danh sách userIds không được để trống")]
        [MinLength(1, ErrorMessage = "Phải có ít nhất 1 user")]
        public List<string> UserIds { get; set; }
        [Required(ErrorMessage = "ID nhóm chat không được để trống")]
        public Guid ChatRoomId { get; set; }
    }
}
