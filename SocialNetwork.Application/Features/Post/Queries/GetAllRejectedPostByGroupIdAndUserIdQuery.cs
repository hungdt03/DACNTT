

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllRejectedPostByGroupIdAndUserIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllRejectedPostByGroupIdAndUserIdQuery(Guid groupId, int page, int size)
        {
            GroupId = groupId;
            Page = page;
            Size = size;
        }
    }
}
