

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Common.Attributes;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class UploadGroupCoverCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Vui lòng cung cấp ID nhóm")]
        public Guid GroupId { get; set; }
        [Required(ErrorMessage = "Vui lòng cung cấp ảnh nhóm")]
        [ImageFile]
        public IFormFile Image { get; set; }
    }
}
