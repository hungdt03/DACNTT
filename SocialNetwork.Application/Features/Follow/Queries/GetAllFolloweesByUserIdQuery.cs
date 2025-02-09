
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Follow.Queries
{
    public class GetAllFolloweesByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllFolloweesByUserIdQuery(string userId, int page, int size)
        {
            UserId = userId;
            Page = page;
            Size = size;
        }
    }
}
