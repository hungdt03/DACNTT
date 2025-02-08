

namespace SocialNetwork.Application.Contracts.Requests
{
    public class MessageRequest
    {
        public string Content { get; set; }
        public string ChatRoomName { get; set; }
        public string? ReceiverId { get; set; }
        public DateTimeOffset SentAt { get; set; }
    }
}
