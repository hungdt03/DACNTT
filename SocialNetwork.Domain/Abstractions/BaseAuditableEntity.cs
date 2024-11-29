
namespace SocialNetwork.Domain.Abstractions
{
    public abstract class BaseAuditableEntity
    {
        public Guid Id { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset? DateUpdated { get; set; }
    }
}
