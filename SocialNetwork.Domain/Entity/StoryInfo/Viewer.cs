using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.StoryInfo
{
    public class Viewer : BaseAuditableEntity
    {
        public Guid StoryId { get; set; }
        public string UserId { get; set; }
        public string? Reaction { get; set; }

        public Story Story { get; set; }
        public User User { get; set; }
    }
}
