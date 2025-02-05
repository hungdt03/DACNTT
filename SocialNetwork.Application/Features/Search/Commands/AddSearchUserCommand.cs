
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.Search.Commands
{
    public class AddSearchUserCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "UserId không được để trống")]
        public string UserId { get; set; }

        public AddSearchUserCommand(string userId)
        {
            UserId = userId;
        }
    }
}
