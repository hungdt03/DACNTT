

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetAllPostByUserIdQuery : IRequest<BaseResponse>
    {
        public string UserId { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public string ContentType { get; set; }
        public string SortOrder { get; set; }
        public string Search { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }

        public GetAllPostByUserIdQuery(string userId, int page, int size, string contentType, string sortOrder, string search, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            UserId = userId;
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
