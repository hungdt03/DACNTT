using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity.System
{
    public class Privacy : BaseAuditableEntity
    {
        public string PrivacyType { get; set; }
        public string PrivacyFor { get; set; }
    }
}
