using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.GroupInfo
{
    public class GroupMember : BaseAuditableEntity
    {
        public Guid GroupId { get; set; }
        public string UserId { get; set; }
        public bool IsAdmin { get; set; }
        public DateTimeOffset JoinDate { get; set; }
        public Group Group { get; set; }
        public User User { get; set; }
    }
}
