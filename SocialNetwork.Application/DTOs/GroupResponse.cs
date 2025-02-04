﻿
namespace SocialNetwork.Application.DTOs
{
    public class GroupResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CoverImage { get; set; }
        public string Privacy { get; set; }
        public List<UserResponse> Members { get; set; }
        public bool IsMine { get; set; }
        public bool IsMember { get; set; }
        public bool OnlyAdminCanPost { get; set; }
        public bool RequireApproval { get; set; }
        public bool RequireApprovalPost { get; set; }
        public bool OnlyAdminCanApprovalMember { get; set; }
        public bool IsHidden { get; set; }
        public int AdminCount { get; set; }
    }
}
