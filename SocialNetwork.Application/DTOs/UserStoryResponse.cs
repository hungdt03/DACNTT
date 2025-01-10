

namespace SocialNetwork.Application.DTOs
{
    public class UserStoryResponse
    {
        public bool HaveSeen {  get; set; }
        public UserResponse User { get; set; }
        public List<StoryResponse> Stories { get; set; }
    }
}
