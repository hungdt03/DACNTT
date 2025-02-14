﻿
namespace SocialNetwork.Application.DTOs
{
    public class ChatRoomResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string UniqueName { get; set; }
        public string ImageUrl { get; set; }
       

        // For chat room
        public string LastMessage { get; set; }
        public DateTimeOffset? LastMessageDate { get; set; }

        // For current user
        public bool IsMember { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsPrivate { get; set; }
        public bool IsAccept { get; set; }
        public bool IsRecipientAccepted { get; set; }

        public ICollection<UserResponse> Members { get; set; }
        public UserResponse Friend {  get; set; }
        public bool IsRead { get; set; }
        public bool IsOnline { get; set; }
        public DateTimeOffset RecentOnlineTime { get; set; }
    }
}
