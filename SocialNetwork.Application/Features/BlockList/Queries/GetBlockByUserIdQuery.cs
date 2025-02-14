

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.BlockList.Queries
{
    public class GetBlockByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetBlockByUserIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
