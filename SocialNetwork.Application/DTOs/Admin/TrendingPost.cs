

namespace SocialNetwork.Application.DTOs.Admin
{
    public class TrendingPost
    {
        public PostResponse Post { get; set; }
        public int Reactions { get; set; }
        public int Comments { get; set; }
        public int Shares { get; set; }
    }
}
