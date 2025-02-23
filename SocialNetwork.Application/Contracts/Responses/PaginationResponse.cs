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
        public int TotalCount { get; set; }
        public bool HasMore { get; set; }
      
    }
    
    public class CommentMentionPaginationResponse : BaseResponse
    {
        public List<CommentResponse> Data { get; set; }
        public CommentMentionPagination Pagination { get; set; }
    }

    public class CommentMentionPagination
    {
        public int PrevPage { get; set; }
        public int NextPage { get; set; }
        public bool HavePrevPage { get; set; }
        public bool HaveNextPage { get; set; }
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
