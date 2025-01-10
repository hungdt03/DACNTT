
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetTopNineOfMyFriendsQuery : IRequest<BaseResponse>
    {
    }
}
