namespace SocialNetwork.Application.DTOs.Search
{
    public class SearchAllResponse
    {
        public List<UserResponse> Users { get; set; }
        public List<GroupResponse> Groups { get; set; }
        public List<PostResponse> Posts { get; set; }
    }
}
