

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Reaction.Commands
{
    public class SaveReactionCommand : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }
        public string ReactionType { get; set; }
    }
}
