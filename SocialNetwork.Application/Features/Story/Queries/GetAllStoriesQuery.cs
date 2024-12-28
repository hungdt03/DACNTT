
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Story.Queries
{
    public class GetAllStoriesQuery : IRequest<BaseResponse>
    {
    }
}
