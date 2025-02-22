
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Common.Attributes;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class UploadCoverImageCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "Chưa chọn file nào")]
        [ImageFile]
        public IFormFile File { get; set; }
    }
}
