

namespace SocialNetwork.Application.DTOs
{
    public class ChatRoomMemberResponse
    {
        public Guid Id { get; set; }
        public UserResponse User { get; set; }
        public bool IsAccepted { get; set; }
        public bool IsLeader { get; set; }
        public bool HasLeftGroup { get; set; }
        public string? LastMessageId { get; set; }
    }
}
