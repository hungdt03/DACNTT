

namespace SocialNetwork.Application.DTOs
{
    public class SearchHistoryResponse
    {
        public Guid Id { get; set; }
        public string SearchText { get; set; }
        public UserResponse User { get; set; }
        public GroupResponse Group { get; set; }
        public DateTimeOffset SearchAt { get; set; }
    }
}
