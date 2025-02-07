

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.BlockList.Commands
{
    public class RemoveBlockUserCommand : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public RemoveBlockUserCommand(string userId)
        {
            UserId = userId;
        }
    }
}
