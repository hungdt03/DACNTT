using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Domain.Entity.GroupInfo
{
    public class Group : BaseAuditableEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Privacy {  get; set; } // Công khai hoặc riêng tư
        public bool IsHidden { get; set; }

        public bool RequireApproval { get; set; } // Duyệt thành viên
        public bool RequirePostApproval { get; set; } // Duyệt bài viết
        public string? CoverImage { get; set; } 

        public ICollection<Post> Posts { get; set; }
        public ICollection<GroupMember> Members { get; set; }
        public ICollection<GroupInvitation> Invites { get; set; }
    }
}
