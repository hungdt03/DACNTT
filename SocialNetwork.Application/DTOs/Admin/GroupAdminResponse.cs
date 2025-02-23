

namespace SocialNetwork.Application.DTOs.Admin
{
    public class GroupAdminResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CoverImage { get; set; }
        public string Privacy { get; set; }
        public int CountMembers { get; set; }
        public int CountTodayPosts { get; set; }
        public int CountPosts { get; set; }
        public bool OnlyAdminCanPost { get; set; }
        public bool RequireApproval { get; set; }
        public bool RequireApprovalPost { get; set; }
        public bool OnlyAdminCanApprovalMember { get; set; }
        public bool IsHidden { get; set; }
        public int AdminCount { get; set; }
        public int ModeratorCount { get; set; }
        public int MemberCount { get; set; }
        public DateTimeOffset DateCreated { get; set; }
    }
}
