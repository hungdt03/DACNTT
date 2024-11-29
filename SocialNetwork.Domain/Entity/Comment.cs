using SocialNetwork.Domain.Abstractions;


namespace SocialNetwork.Domain.Entity
{
    public class Comment : BaseAuditableEntity
    {
        public string Content { get; set; }
        public string MediaType { get; set; }
        public string MediaUrl { get; set; }
        public Guid? ParentCommentId { get; set; }
        public Comment ParentComment { get; set; }
        public Guid PostId { get; set; }
        public Post Post { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public ICollection<Comment> Replies { get; set; }
    }
}
