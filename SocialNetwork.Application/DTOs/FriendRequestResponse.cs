
namespace SocialNetwork.Application.DTOs
{
    public class FriendRequestResponse
    {
        public Guid Id { get; set; }
        public UserResponse Sender { get; set; }
        public string ReceiverId { get; set; }
        public string SenderId { get; set; }
        public string Status { get; set; }
        public bool IsConnect {  get; set; }
        public DateTimeOffset SentAt { get; set; }
    }
}
