

namespace SocialNetwork.Application.DTOs.Admin
{
    public class WeeklyInteraction
    {
        public DateTimeOffset Date { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public int Shares { get; set; }
    }
}
