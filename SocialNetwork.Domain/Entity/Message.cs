

using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class Message : BaseAuditableEntity
    {
        public string Content { get; set; } 
        public string MessageType { get; set; }
        public string? SenderId { get; set; } 
        public User Sender { get; set; }
        public Guid ChatRoomId { get; set; } 
        public ChatRoom ChatRoom { get; set; }
        public ICollection<MessageMedia> Medias { get; set; }
        public ICollection<MessageReadStatus> Reads { get; set; }
        public DateTimeOffset SentAt { get; set; }
    }
}
