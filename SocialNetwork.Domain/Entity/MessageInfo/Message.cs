using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.ChatRoomInfo;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.MessageInfo
{
    public class Message : BaseAuditableEntity
    {
        public string? Content { get; set; }
        public string MessageType { get; set; }
        public bool IsRemove { get; set; }

        public Guid? ForwardedMessageId { get; set; }
        public Message? ForwardedMessage { get; set; }

        public Guid? ReplyMessageId { get; set; }
        public Message? ReplyMessage { get; set; }

        public Guid? StoryId { get; set; }
        public Story? Story { get; set; }

        public string? SenderId { get; set; }
        public User? Sender { get; set; }

        public Guid ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }
     
        public ICollection<MessageMedia> Medias { get; set; }
        public ICollection<MessageReadStatus> Reads { get; set; }
        public DateTimeOffset SentAt { get; set; }
    }
}
