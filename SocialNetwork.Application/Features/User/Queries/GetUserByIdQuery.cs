

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetUserByIdQuery : IRequest<BaseResponse>
    {
        public string UserId {  get; set; }

        public GetUserByIdQuery(string userId)
        {
            UserId = userId;
        }
    }
}
