

using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.UserInfo
{
    public class SearchHistory : BaseAuditableEntity
    {
        public string UserId { get; set; }
        public string? SearchText { get; set; }
        public Guid? SearchGroupId { get; set; }
        public Group? SearchGroup { get; set; }
        public string? SearchUserId { get; set; }
        public User? SearchUser { get; set; }
        public User User { get; set; }
    }
}
