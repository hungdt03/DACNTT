
namespace SocialNetwork.Application.DTOs
{
    public class CommentResponse
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public Guid? ParentCommentId { get; set; }
        public string? ReplyToUserId { get; set; }
        public string? ReplyToUserName { get; set; }
        public string? MediaUrl { get; set; }
        public UserResponse User { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public bool IsHaveChildren { get; set; }
    }
}
