

using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class OTP : BaseAuditableEntity
    {
        public string Code { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public string Type { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
    }
}
