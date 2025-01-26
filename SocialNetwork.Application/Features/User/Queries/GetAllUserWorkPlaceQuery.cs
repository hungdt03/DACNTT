

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetAllUserWorkPlaceQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetAllUserWorkPlaceQuery(string userId)
        {
            UserId = userId;
        }
    }
}
