using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.PostInfo
{
    public class Reaction : BaseAuditableEntity
    {
        public Guid PostId { get; set; }
        public Post Post { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string Type { get; set; }
    }
}
