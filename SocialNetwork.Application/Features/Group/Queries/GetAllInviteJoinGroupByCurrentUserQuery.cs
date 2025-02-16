
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Queries
{
    public class GetAllInviteJoinGroupByCurrentUserQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllInviteJoinGroupByCurrentUserQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
