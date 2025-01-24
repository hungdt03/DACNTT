

using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.UserInfo
{
    public class UserWorkPlace : BaseAuditableEntity
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public Guid? PositionId { get; set; }
        public Position? Position { get; set; }
        public Guid CompanyId { get; set; }
        public Company Company { get; set; }
        public bool IsCurrent { get; set; }
    }
}
