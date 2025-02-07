

namespace SocialNetwork.Application.DTOs
{
    public class SuggestUserResponse
    {
        public UserResponse User { get; set; }
        public List<UserResponse> MutualFriends { get; set; }
    }
}
