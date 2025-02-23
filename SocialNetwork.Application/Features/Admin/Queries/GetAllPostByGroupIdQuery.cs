using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Admin.Queries
{
    public class GetAllPostByGroupIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public int Page { get; set; }
        public int Size { get; set; }
        public string Search { get; set; }
        public string AuthorId { get; set; }
        public string SortOrder { get; set; }
        public string ContentType { get; set; }
        public DateTimeOffset? FromDate { get; set; }
        public DateTimeOffset? ToDate { get; set; }

        public GetAllPostByGroupIdQuery(Guid groupId, int page, int size, string search, string authorId, string sortOrder, string contentType, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            GroupId = groupId;
            Page = page;
            Size = size;
            Search = search;
            SortOrder = sortOrder;
            ContentType = contentType;
            FromDate = fromDate;
            ToDate = toDate;
            AuthorId = authorId;
        }
    }
}
