

namespace SocialNetwork.Application.DTOs
{
    public class UserResponse
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Bio {  get; set; }
        public string Avatar { get; set; }
        public int PostCount { get; set; }
        public int FollowerCount { get; set; }  
        public int FollowingCount { get; set; }
        public int FriendCount { get; set; }
    }
}
