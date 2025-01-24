using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Domain.Entity.GroupInfo
{
    public class Group : BaseAuditableEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool RequireApproval { get; set; }
        public bool RequirePostApproval { get; set; }
        public string Avatar { get; set; }
        public string CoverImage { get; set; }

        public ICollection<Post> Posts { get; set; }
        public ICollection<GroupMember> Members { get; set; }
        public ICollection<GroupInvitation> Invites { get; set; }
    }
}
