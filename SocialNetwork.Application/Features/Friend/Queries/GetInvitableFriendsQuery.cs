
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetInvitableFriendsQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public GetInvitableFriendsQuery(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
