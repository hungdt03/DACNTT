using SocialNetwork.Application.DTOs;

namespace SocialNetwork.Application.Contracts.Responses
{
    public class PaginationResponse<T> : DataResponse<T>
    {
        public Pagination Pagination { get; set; }
    }

    public class Pagination
    {
        public int Page { get; set; }
        public int Size { get; set; }
        public int TotalPages { get; set; }
        public bool HasMore { get; set; }
    }

    public class CommentPaginationResponse : BaseResponse
    {
        public List<CommentResponse> Data { get; set; }
        public CommentResponse Pagination { get; set; }
    }

    public class CommentPagination
    {
        public int Page { get; set; }
        public int Size { get; set; }
        public int TotalPages { get; set; }
        public bool HasMore { get; set; }
        public bool HasReplies { get; set; }
    }
}
