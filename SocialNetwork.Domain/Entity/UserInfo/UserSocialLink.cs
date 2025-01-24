

using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.UserInfo
{
    public class UserSocialLink : BaseAuditableEntity
    {
        public string UserId { get; set; }  
        public string Type { get; set; }
        public string SocialMediaLink { get; set; }
        public User User { get; set; }
    }
}
