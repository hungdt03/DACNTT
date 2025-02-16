

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllMemberPostByMemberQuery : IRequest<BaseResponse>
    {
        public Guid MemberId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllMemberPostByMemberQuery(Guid memberId, int page, int size)
        {
            MemberId = memberId;
            Page = page;
            Size = size;
        }
    }
}
