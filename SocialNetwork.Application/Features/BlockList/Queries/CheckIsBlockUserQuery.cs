
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.BlockList.Queries
{
    public class CheckIsBlockUserQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public CheckIsBlockUserQuery(string userId)
        {
            UserId = userId;
        }
    }
}
