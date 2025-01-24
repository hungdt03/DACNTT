using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity.System
{
    public class Position : BaseAuditableEntity
    {
        public string Name { get; set; }
    }
}
