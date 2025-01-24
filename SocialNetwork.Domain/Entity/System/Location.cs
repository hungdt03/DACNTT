using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity.System
{
    public class Location : BaseAuditableEntity
    {
        public string Address { get; set; }
    }
}
