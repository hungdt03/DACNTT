using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity.System
{
    public class Company : BaseAuditableEntity
    {
        public string Name { get; set; }
    }
}
