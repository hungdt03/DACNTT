using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllMyPostsQuery : IRequest<BaseResponse>
    {
        public int Page { get; set; }
        public int Size { get; set; }
        public string ContentType { get; set; }
        public string SortOrder { get; set; }
        public string Search { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }

        public GetAllMyPostsQuery(int page, int size, string contentType, string sortOrder, string search, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            Page = page;
            Size = size;
            ContentType = contentType;
            SortOrder = sortOrder;
            Search = search;
            FromDate = fromDate;
            ToDate = toDate;
        }
    }
}
