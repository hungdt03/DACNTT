

using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.GroupInfo
{
    public class JoinGroupRequest : BaseAuditableEntity
    {
        public string UserId { get; set; }
        public bool Status { get; set; }
        public Guid GroupId { get; set; }
        public User User { get; set; }
        public Group Group { get; set; }
    }
}
