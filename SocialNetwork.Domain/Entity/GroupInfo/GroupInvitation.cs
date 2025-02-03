using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.GroupInfo
{
    public class GroupInvitation : BaseAuditableEntity
    {
        public Guid GroupId { get; set; }
        public string InviterId { get; set; } // Người gửi lời mời
        public string InviteeId { get; set; } // Người được mời
        public bool Status { get; set; }
        public Group Group { get; set; }
        public User Inviter { get; set; }
        public User Invitee { get; set; }
    }
}
