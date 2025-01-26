
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity.System
{
    public class Profession : BaseAuditableEntity
    {
        public string Name { get; set; }
    }
}
