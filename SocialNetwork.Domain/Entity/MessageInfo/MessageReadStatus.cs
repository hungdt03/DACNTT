using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.MessageInfo
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
