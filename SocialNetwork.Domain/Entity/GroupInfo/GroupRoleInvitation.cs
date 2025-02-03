
using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.GroupInfo
{
    public class GroupRoleInvitation : BaseAuditableEntity
    {
        public string InviterId { get; set; }
        public User Inviter { get; set; }
        public string InviteeId { get; set; }
        public User Invitee { get; set; }
        public string Role {  get; set; }
    }
}
