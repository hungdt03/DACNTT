
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetAllUserSchoolQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }

        public GetAllUserSchoolQuery(string userId)
        {
            UserId = userId;
        }
    }
}
