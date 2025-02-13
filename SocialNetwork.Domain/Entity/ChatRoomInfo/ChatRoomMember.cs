using SocialNetwork.Domain.Abstractions;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Domain.Entity.ChatRoomInfo
{
    public class ChatRoomMember : BaseAuditableEntity
    {
        public string UserId { get; set; }
        public User User { get; set; }

        public Guid ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }
        public bool IsAccepted { get; set; }
        public bool IsLeader { get; set; }
    }
}
