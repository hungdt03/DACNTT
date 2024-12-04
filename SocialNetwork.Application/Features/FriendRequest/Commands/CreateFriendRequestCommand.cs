
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.FriendRequest.Commands
{
    public class CreateFriendRequestCommand : IRequest<BaseResponse>
    {
        [Required(ErrorMessage = "ID người nhận không được để trống")]
        public string ReceiverId { get; set; }
    }
}
