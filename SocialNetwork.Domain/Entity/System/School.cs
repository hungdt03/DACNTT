using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity.System
{
    public class School : BaseAuditableEntity
    {
        public string Name { get; set; }
    }
}
