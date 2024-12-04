
namespace SocialNetwork.Application.DTOs
{
    public class NotificationDTO
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public string ReceiverId { get; set; }
        public string Type { get; set; }
        public DateTimeOffset SentAt { get; set; }
        public string ImageUrl {  get; set; }
        public Guid ReferenceId { get; set; }
    }
}
