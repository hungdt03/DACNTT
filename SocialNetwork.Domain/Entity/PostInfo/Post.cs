using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.PostInfo
{
    public class Post : BaseAuditableEntity
    {
        public string Content { get; set; }
        public string? Background { get; set; }
        public string Privacy { get; set; }
        public string PostType { get; set; }
        public bool IsGroupPost { get; set; }
        public bool IsApproved { get; set; }

        public Guid? GroupId { get; set; }
        public Group? Group { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }

        public Guid? SharePostId { get; set; }
        public Post SharePost { get; set; }

        public Guid? OriginalPostId { get; set; }
        public Post OriginalPost { get; set; }

        public ICollection<Post> Shares { get; set; } = new List<Post>();
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Reaction> Reactions { get; set; }
        public ICollection<PostMedia> Medias { get; set; }
    }
}
