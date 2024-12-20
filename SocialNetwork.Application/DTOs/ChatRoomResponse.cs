
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.DTOs
{
    public class ChatRoomResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string UniqueName { get; set; }
        public bool IsPrivate { get; set; }
        public string LastMessage { get; set; }
        public DateTimeOffset? LastMessageDate { get; set; }
        public ICollection<UserResponse> Members { get; set; }
        public UserResponse Friend {  get; set; }
    }
}
