using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class Friend : BaseAuditableEntity
    {
        public string FirstUserId { get; set; }
        public User FirstUser { get; set; }
        public string LastUserId { get; set; }
        public User LastUser { get; set; }
        public DateTimeOffset ConnectedAt { get; set; }
    }
}
