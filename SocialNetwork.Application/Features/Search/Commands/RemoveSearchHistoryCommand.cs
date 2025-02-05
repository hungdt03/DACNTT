using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Search.Commands
{
    public class RemoveSearchHistoryCommand : IRequest<BaseResponse>
    {
        public Guid SearchHistoryId { get; set; }

        public RemoveSearchHistoryCommand(Guid searchHistoryId)
        {
            SearchHistoryId = searchHistoryId;
        }
    }
}
