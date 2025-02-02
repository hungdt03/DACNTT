

namespace SocialNetwork.Application.DTOs.Search
{
    public class SearchUserSuggestResponse
    {
        public UserResponse User { get; set; }
        public bool IsFriend { get; set; }
        public int MutualFriends {  get; set; }
        public bool PlainText { get; set; }
    }
}
