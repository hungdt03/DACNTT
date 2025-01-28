
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class CreateGroupCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp tên nhóm")]
        public string Name { get; set; }
        public IFormFile? CoverImage { get; set; }
        [Required(ErrorMessage = "Vui lòng nhập mô tả ngắn về nhóm")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Vui lòng cung cấp quyền riêng tư của nhóm")]
        public string Privacy { get; set; }
    }
}
