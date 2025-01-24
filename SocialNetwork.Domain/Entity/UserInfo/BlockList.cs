

using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.UserInfo
{
    public class BlockList : BaseAuditableEntity
    {
        public string BlockerId { get; set; } // Người chặn
        public User Blocker { get; set; }
        public string BlockeeId { get; set; } // Người bị chặn
        public User Blockee { get; set; }
    }
}
