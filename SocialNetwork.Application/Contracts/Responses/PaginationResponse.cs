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
    }
}
