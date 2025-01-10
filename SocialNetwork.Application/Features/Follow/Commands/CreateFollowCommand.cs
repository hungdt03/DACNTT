
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Follow.Commands
{
    public class CreateFollowCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID người được theo dõi không được để trống")]
        public string FolloweeId { get; set; }
    }
}
