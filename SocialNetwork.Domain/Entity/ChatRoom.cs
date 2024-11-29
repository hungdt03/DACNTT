using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class ChatRoom : BaseAuditableEntity
    {
        public string Name { get; set; }
        public string UniqueName { get; set; }
        public bool IsPrivate { get; set; }
        public Guid LastMessageId { get; set; } 
        public DateTimeOffset? LastMessageDate { get; set; } 
        public ICollection<ChatRoomMember> Members { get; set; } 
        public ICollection<Message> Messages { get; set; } 
    }
}
