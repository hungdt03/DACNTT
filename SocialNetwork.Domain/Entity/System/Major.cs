

using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity.System
{
    public class Major : BaseAuditableEntity
    {
        public string Name { get; set; }
    }
}
