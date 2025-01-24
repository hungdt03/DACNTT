using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity.MessageInfo
{
    public class MessageMedia : BaseAuditableEntity
    {
        public string MediaUrl { get; set; }
        public string MediaType { get; set; }
        public Guid MessageId { get; set; }
        public Message Message { get; set; }
    }
}
