
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.BlockList.Queries
{
    public class GetAllBlockUsersQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllBlockUsersQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
