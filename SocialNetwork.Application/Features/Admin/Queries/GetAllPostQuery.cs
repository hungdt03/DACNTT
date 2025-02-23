using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetAllPostQuery : IRequest<BaseResponse>
    {
        public int Page {  get; set; }
        public int Size { get; set; }
        public string Search {  get; set; }
        public string SortOrder { get; set; }
        public string ContentType { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }

        public GetAllPostQuery(int page, int size, string search, string sortOrder, string contentType, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            Page = page;
            Size = size;
            Search = search;
            SortOrder = sortOrder;
            ContentType = contentType;
            FromDate = fromDate;
            ToDate = toDate;
        }
    }
}
