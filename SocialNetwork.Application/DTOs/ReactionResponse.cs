

namespace SocialNetwork.Application.DTOs
{
    public class ReactionResponse
    {
        public Guid Id { get; set; }
        public Guid PostId { get; set; }
        public string ReactionType { get; set; }
        public UserResponse User { get; set; }
    }
}
