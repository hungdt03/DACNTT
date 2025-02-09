

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetAllMyFriendsFullInfoQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetAllMyFriendsFullInfoQuery(int page, int size)
        {
            Page = page;
            Size = size;
        }
    }
}
