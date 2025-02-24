

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetAllAdminAccountQuery : IRequest<BaseResponse>
    {
        public int Page { get; set; }
        public int Size { get; set; }
        public string Search {  get; set; }

        public GetAllAdminAccountQuery(int page, int size, string search)
        {
            Page = page;
            Size = size;
            Search = search;
        }
    }
}
