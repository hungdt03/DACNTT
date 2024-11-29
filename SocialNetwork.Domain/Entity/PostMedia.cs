
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class PostMedia : BaseAuditableEntity
    {
        public string MediaUrl { get; set; }
        public string MediaType { get; set; }
        public Guid PostId { get; set; }
        public Post Post { get; set; }
    }
}
