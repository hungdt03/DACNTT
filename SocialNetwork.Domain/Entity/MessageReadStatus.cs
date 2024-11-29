
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class MessageReadStatus : BaseAuditableEntity
    {
        public string UserId { get; set; } 
        public User User { get; set; } 

        public Guid MessageId { get; set; }
        public Message Message { get; set; } 

        public bool IsRead { get; set; } 
        public DateTimeOffset? ReadAt { get; set; } 
    }
}
