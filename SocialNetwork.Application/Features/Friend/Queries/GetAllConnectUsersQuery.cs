

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetAllConnectUsersQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }
        public string Query { get; set; }

        public GetAllConnectUsersQuery(int page, int size, string query)
        {
            Page = page;
            Size = size;
            Query = query;
        }
    }
}
