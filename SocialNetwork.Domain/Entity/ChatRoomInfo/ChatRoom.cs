using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.MessageInfo;

namespace SocialNetwork.Domain.Entity.ChatRoomInfo
{
    public class ChatRoom : BaseAuditableEntity
    {
        public string Name { get; set; }
        public string UniqueName { get; set; }
        public bool IsPrivate { get; set; }
        public string LastMessage { get; set; }
        public DateTimeOffset? LastMessageDate { get; set; }
        public ICollection<ChatRoomMember> Members { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
