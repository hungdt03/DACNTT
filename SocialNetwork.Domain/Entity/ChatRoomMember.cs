
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class ChatRoomMember : BaseAuditableEntity
    {
        public string UserId { get; set; }
        public User User { get; set; }

        public Guid ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }

        public bool IsActive { get; set; } 
    }
}
