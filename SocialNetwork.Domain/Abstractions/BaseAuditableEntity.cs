
namespace SocialNetwork.Domain.Abstractions
{
    public abstract class BaseAuditableEntity : ISoftDelete
    {
        public Guid Id { get; set; }
        public DateTimeOffset DateCreated { get; set; }
        public DateTimeOffset? DateUpdated { get; set; }
        public bool IsDeleted { get ; set; }
        public DateTimeOffset DeletedAt { get; set; }
    }
}
