using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetAllGroupQuery(int page, int size, string search, string privacy) : IRequest<BaseResponse>
    {
        public int Page { get; set; } = page;
        public int Size { get; set; } = size;
        public string Search { get; set; } = search;
        public string Privacy { get; set; } = privacy;
    }
}
