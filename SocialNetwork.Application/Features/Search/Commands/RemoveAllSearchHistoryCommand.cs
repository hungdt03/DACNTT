
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Search.Commands
{
    public class RemoveAllSearchHistoryCommand : IRequest<BaseResponse>
    {
    }
}
