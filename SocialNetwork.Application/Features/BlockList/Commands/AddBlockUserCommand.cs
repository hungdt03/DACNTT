
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.BlockList.Commands
{
    public class AddBlockUserCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID người bị chặn không được để trống")]
        public string UserId { get; set; }
    }
}
