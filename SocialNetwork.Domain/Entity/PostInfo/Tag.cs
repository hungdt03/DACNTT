using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.PostInfo
{
    public class Tag : BaseAuditableEntity
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public Guid PostId { get; set; }
        public Post Post { get; set; }
    }
}
