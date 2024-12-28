

namespace SocialNetwork.Application.DTOs
{
    public class UserStoryResponse
    {
        public UserResponse User { get; set; }
        public List<StoryResponse> Stories { get; set; }
    }
}
