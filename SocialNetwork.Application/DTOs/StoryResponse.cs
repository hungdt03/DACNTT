
namespace SocialNetwork.Application.DTOs
{
    public class StoryResponse
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public string Background {  get; set; }
        public string FontFamily { get; set; }
        public string Type { get; set; }
        public string Privacy { get; set; }
        public string Thumbnail { get; set; }
        public UserResponse User { get; set; }
        public DateTimeOffset CreatedDate { get; set; }
    }
}
