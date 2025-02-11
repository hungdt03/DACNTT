
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.DTOs
{
    public class NotificationResponse
    {
        public Guid Id { get; set; }
        public string Type { get; set; } 
        public string Title { get; set; } 
        public string Content { get; set; }
        public string ImageUrl { get; set; }
        public UserResponse Recipient { get; set; }
        public bool IsRead { get; set; }

        public Guid? PostId { get; set; }
        public Guid? StoryId { get; set; }
        public Guid? CommentId { get; set; }
        public Guid? FriendRequestId { get; set; }
        public FriendRequestResponse? FriendRequest { get; set; }
        public Guid? GroupId { get; set; }
        public Guid? GroupInvitationId { get; set; }

        // Thời gian gửi thông báo
        public DateTimeOffset DateSent { get; set; }
    }
}
