
using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.UserInfo
{
    public class SavedPost : BaseAuditableEntity
    {
        public Guid? PostId { get; set; }
        public string UserId { get; set; }
        public Post? Post { get; set; }
        public User User { get; set; }
    }
}
