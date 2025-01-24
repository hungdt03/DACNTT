using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Domain.Entity.System
{
    public class Notification : BaseAuditableEntity
    {
        public string Type { get; set; } // Kiểu thông báo (kết bạn, chia sẻ bài viết, bình luận, phản hồi, v.v.)
        public string Title { get; set; } // Nội dung thông báo (tóm tắt hoặc mô tả ngắn về hành động)
        public string Content { get; set; } // Nội dung thông báo (tóm tắt hoặc mô tả ngắn về hành động)
        public string ImageUrl { get; set; }
        // Người nhận thông báo
        public string RecipientId { get; set; }
        public User Recipient { get; set; }
        public bool IsRead { get; set; }

        // Đối tượng mà thông báo liên quan đến (ví dụ: bài viết, bạn bè, bình luận)
        public Guid? PostId { get; set; }
        public Post Post { get; set; }
        public Guid? CommentId { get; set; }
        public Comment Comment { get; set; }
        public Guid? FriendRequestId { get; set; }
        public FriendShip FriendRequest { get; set; }
        public Guid? StoryId { get; set; }
        public Story Story { get; set; }

        // Thời gian gửi thông báo
        public DateTimeOffset DateSent { get; set; }
    }

}
