
namespace SocialNetwork.Application.DTOs.Search
{
    public class SearchGroupSuggestResponse
    {
        public GroupResponse Group { get; set; }
        public int FriendMembers {  get; set; }
        public bool IsMember { get; set; }
        public bool PlainText { get; set; }
    }
}
