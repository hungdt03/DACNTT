
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class Post : BaseAuditableEntity
    {
        public string Content {  get; set; }
        public string? Background {  get; set; }
        public string Privacy { get; set; }
        public string PostType { get; set; } 
        public string UserId { get; set; }
        public User User { get; set; }
        public Guid? OriginalPostId { get; set; }
        public Post OriginalPost { get; set; }
        public ICollection<Post> Shares { get; set; } = new List<Post>();
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Reaction> Reactions { get; set; }
        public ICollection<PostMedia> Medias { get; set; }
    }
}
