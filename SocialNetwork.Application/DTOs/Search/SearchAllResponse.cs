namespace SocialNetwork.Application.DTOs.Search
{
    public class SearchAllResponse
    {
        public List<SearchUserSuggestResponse> Users { get; set; }
        public List<SearchGroupSuggestResponse> Groups { get; set; }
        public List<PostResponse> Posts { get; set; }
    }
}
