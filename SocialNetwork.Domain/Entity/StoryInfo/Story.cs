using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.MessageInfo;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.StoryInfo
{
    public class Story : BaseAuditableEntity
    {
        public string? Content { get; set; }
        public string Background { get; set; }
        public string? FontFamily { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public string Privacy { get; set; }
        public string UserId { get; set; }
        public string Type { get; set; }
        public User User { get; set; }
        public ICollection<Viewer> Viewers { get; set; }
        public ICollection<Message> ReplyMessages { get; set; }
    }
}
