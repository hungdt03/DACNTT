
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class Follow : BaseAuditableEntity
    {
        public string FollowerId { get; set; }
        public User Follower { get; set; }
        public string FolloweeId { get; set; }
        public User Followee { get; set; }
        public string Status { get; set; }
    }
}
