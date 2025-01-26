

using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.UserInfo
{
    public class UserSchool : BaseAuditableEntity
    {
        public string UserId { get; set; }
        public Guid? MajorId { get; set; }
        public Guid SchoolId { get; set; }
        public int? StartYear { get; set; }
        public string Status { get; set; }
        public User User { get; set; }
        public School School { get; set; }
        public Major? Major { get; set; }
    }

}
