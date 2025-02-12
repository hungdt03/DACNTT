

namespace SocialNetwork.Application.DTOs
{
    public class UserResponse
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public DateTimeOffset DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public bool IsDeleted { get; set; }
        public string Bio {  get; set; }
        public string Avatar { get; set; }
        public string CoverImage { get; set; }
        public int PostCount { get; set; }
        public int FollowerCount { get; set; }  
        public int FollowingCount { get; set; }
        public int FriendCount { get; set; }
        public bool IsOnline { get; set; }
        public DateTimeOffset RecentOnlineTime { get; set; }
        public bool HaveStory { get; set; }
        public bool Isverification { get; set; }
        public string Location { get; set; }
        public DateTimeOffset DateJoined { get; set; }
    }
}
