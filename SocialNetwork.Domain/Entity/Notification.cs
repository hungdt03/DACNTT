
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Domain.Entity
{
    public class Notification : BaseAuditableEntity
    {
        public string Type { get; set; } // Kiểu thông báo (kết bạn, chia sẻ bài viết, bình luận, phản hồi, v.v.)
        public string Content { get; set; } // Nội dung thông báo (tóm tắt hoặc mô tả ngắn về hành động)

        // Người nhận thông báo
        public string RecipientId { get; set; }
        public User Recipient { get; set; }
        public string SenderId { get; set; }
        public User Sender { get; set; }
        public bool IsRead { get; set; }

        // Đối tượng mà thông báo liên quan đến (ví dụ: bài viết, bạn bè, bình luận)
        public Guid? PostId { get; set; }
        public Post Post { get; set; }
        public Guid? CommentId { get; set; }
        public Comment Comment { get; set; }
        public Guid? FriendRequestId { get; set; }
        public FriendRequest FriendRequest { get; set; }

        // Thời gian gửi thông báo
        public DateTimeOffset DateSent { get; set; }
    }

}
