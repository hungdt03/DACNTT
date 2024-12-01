using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllPostQuery : IRequest<BaseResponse>
    {
    }
}
