

namespace SocialNetwork.Application.DTOs.Search
{
    public class SearchUserSuggestResponse
    {
        public UserResponse User { get; set; }
        public bool IsFriend { get; set; }
        public bool IsFollow { get; set; }
        public List<FriendResponse> MutualFriends {  get; set; }
        public int CountMutualFriends { get; set; }
        public bool PlainText { get; set; }
    }
}
