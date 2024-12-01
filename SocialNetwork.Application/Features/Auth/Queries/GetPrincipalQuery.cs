
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Auth.Queries
{
    public class GetPrincipalQuery : IRequest<BaseResponse>
    {
    }
}
