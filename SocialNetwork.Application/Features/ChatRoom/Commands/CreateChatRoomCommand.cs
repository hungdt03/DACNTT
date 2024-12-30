

using MediatR;
using SocialNetwork.Application.Common.Attributes;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.ChatRoom.Commands
{
    public class CreateChatRoomCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Tên nhóm không được để trống")]
        public string GroupName { get; set; }

        [MinItems(2, ErrorMessage = "Danh sách phải chứa ít nhất 2 thành viên.")]
        public List<string> MemberIds { get; set; }
    }
}
