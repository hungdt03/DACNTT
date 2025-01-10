
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Follow.Commands
{
    public class UnfollowUserCommand : IRequest<BaseResponse>
    {
        public UnfollowUserCommand(string followeeId)
        {
            FolloweeId = followeeId;
        }

        public string FolloweeId { get; set; }
    }
}
