
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class FriendShip : BaseAuditableEntity
    {
        public string Status { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string FriendId { get; set; }
        public User Friend { get; set; }
    }
}
