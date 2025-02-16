
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetInvitableFriendsQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public string Query { get; set; }

        public GetInvitableFriendsQuery(Guid groupId, string query)
        {
            GroupId = groupId;
            Query = query;
        }
    }
}
