

namespace SocialNetwork.Application.DTOs.Admin
{
    public class TopReactionWeek
    {
        public string Type { get; set; }
        public DateTimeOffset Date { get; set; }
        public int Count { get; set; }
    }
}
