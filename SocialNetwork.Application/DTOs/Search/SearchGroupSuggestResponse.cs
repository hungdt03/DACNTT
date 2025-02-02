
namespace SocialNetwork.Application.DTOs.Search
{
    public class SearchGroupSuggestResponse
    {
        public GroupResponse Group { get; set; }
        public int CountFriendMembers {  get; set; }
        public int TotalMembers { get; set; }
        public bool IsMember { get; set; }
        public bool PlainText { get; set; }
        public List<UserResponse> FriendMembers { get; set; }
    }
}
