
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetAllFriendsQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }
    }
}
