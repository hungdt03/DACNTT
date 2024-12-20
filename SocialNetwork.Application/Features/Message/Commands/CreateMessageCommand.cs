

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Message.Commands
{
    public class CreateMessageCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string Content { get; set; }
        [Required(ErrorMessage = "Đoạn chat ID không được để trống")]
        public string ChatRoomName { get; set; }
        public List<IFormFile>? Images { get; set; }
        public List<IFormFile>? Videos { get; set; }
    }
}
