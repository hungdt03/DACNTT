using MediatR;
using SocialNetwork.Application.Contracts.Responses;


namespace SocialNetwork.Application.Features.Search.Queries
{
    public class SearchPostQuery : IRequest<BaseResponse>
    {
        public string Query { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }
        public string SortOrder { get; set; }
        public string ContentType { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }

        public SearchPostQuery(string query, int page, int size, string sortOrder, string contentType, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            Query = query;
            Page = page;
            Size = size;
            SortOrder = sortOrder;
            ContentType = contentType;
            FromDate = fromDate;
            ToDate = toDate;
        }
    }
}
