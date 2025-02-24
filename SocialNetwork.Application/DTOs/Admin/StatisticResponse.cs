

using SocialNetwork.Application.DTOs.Score;

namespace SocialNetwork.Application.DTOs.Admin
{
    public class StatisticResponse
    {
        public int CountGroups { get; set; }
        public int CountPosts {  get; set; }
        public int CountUsers { get; set; } 
        public int CountOnlineUsers { get; set; } 
        public int CountOfflineUsers { get; set; }
        public int CountReports { get; set; }
        public int CountConnections { get; set; }
        public List<UserScore> Top10UserScores { get; set; }
        public List<UserFollow> Top5Followers { get; set; }
        public List<TopReactionWeek> TopReactionWeeks { get; set; }
    }
}
