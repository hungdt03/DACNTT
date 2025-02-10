
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.ChatRoom.Commands
{
    public class UploadAvatarChatRoomCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID của nhóm chat không được để trống")]
        public Guid ChatRoomId { get; set; }
        [Required(ErrorMessage = "Ảnh không được để trống")]
        public IFormFile Image {  get; set; }
    }
}
