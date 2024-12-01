

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Reaction.Queries
{
    public class GetAllReactionsByPostIdQuery : IRequest<BaseResponse>
    {
        public Guid PostId { get; set; }

        public GetAllReactionsByPostIdQuery(Guid postId)
        {
            PostId = postId;
        }
    }
}
