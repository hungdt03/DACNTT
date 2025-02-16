

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class UploadGroupCoverCommand : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public IFormFile Image { get; set; }
    }
}
