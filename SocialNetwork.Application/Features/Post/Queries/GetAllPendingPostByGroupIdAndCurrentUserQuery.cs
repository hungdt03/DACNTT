
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllPendingPostByGroupIdAndCurrentUserQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllPendingPostByGroupIdAndCurrentUserQuery(Guid groupId, int page, int size)
        {
            GroupId = groupId;
            Page = page;
            Size = size;
        }
    }
}
