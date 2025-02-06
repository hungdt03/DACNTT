using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetGroupImagesQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }
        public Guid GroupId { get; set; }

        public GetGroupImagesQuery(int page, int size, Guid groupId)
        {
            Page = page;
            Size = size;
            GroupId = groupId;
        }
    }
}
