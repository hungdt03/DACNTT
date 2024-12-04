using SocialNetwork.Domain.Abstractions;


namespace SocialNetwork.Domain.Entity
{
    public class Comment : BaseAuditableEntity
    {
        public string? Content { get; set; }
        public string? MediaType { get; set; }
        public string? MediaUrl { get; set; }
        public string? ReplyToUserId { get; set; }
        public string? ReplyToUserName { get; set; }
        public Guid? ParentCommentId { get; set; }
        public Comment ParentComment { get; set; }
        public Guid PostId { get; set; }
        public Post Post { get; set; }
        public string UserId { get; set; } // Who create comment
        public User User { get; set; } // Who create comment
        public ICollection<Comment> Replies { get; set; }
    }
}
