
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
    }
}
