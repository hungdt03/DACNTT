

namespace SocialNetwork.Application.DTOs
{
    public class MessageResponse
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public string MessageType { get; set; }
        public string? SenderId { get; set; }
        public UserResponse Sender { get; set; }
        public Guid ChatRoomId { get; set; }
        public ICollection<MediaResponse> Medias { get; set; }
        public DateTimeOffset SentAt { get; set; }
        public List<ReadStatus> Reads { get; set; }

        // Bổ sung cho việc xóa thành viên khỏi group
        public bool IsRemoveMember { get; set; }
        public string RemoveMemberId { get; set; }
    }

    public class ReadStatus
    {
        public UserResponse User { get; set; }
        public string UserId { get; set; }
        public DateTimeOffset? ReadAt { get; set; }
    }
}
