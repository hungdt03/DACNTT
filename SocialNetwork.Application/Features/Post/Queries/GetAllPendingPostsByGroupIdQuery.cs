
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Post.Queries
{
    public class GetAllPendingPostsByGroupIdQuery : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }
        public string SortOrder { get; set; }
        public string Query { get; set; }
        public string? UserId { get; set; }
        public string ContentType { get; set; }
        public DateTimeOffset? Date {  get; set; }

        public GetAllPendingPostsByGroupIdQuery(Guid groupId, int page, int size, string sortOrder, string query, string? userId, string contentType, DateTimeOffset? date)
        {
            GroupId = groupId;
            Page = page;
            Size = size;
            SortOrder = sortOrder;
            Query = query;
            UserId = userId;
            ContentType = contentType;
            Date = date;
        }
    }
}
