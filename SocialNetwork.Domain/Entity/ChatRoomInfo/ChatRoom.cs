using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.MessageInfo;

namespace SocialNetwork.Domain.Entity.ChatRoomInfo
{
    public class ChatRoom : BaseAuditableEntity
    {
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string UniqueName { get; set; }
        public bool IsPrivate { get; set; }
        public string? LastMessage { get; set; } = string.Empty;
        public DateTimeOffset? LastMessageDate { get; set; } = DateTimeOffset.MinValue;
        public ICollection<ChatRoomMember> Members { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
