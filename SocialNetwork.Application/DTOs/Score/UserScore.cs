

namespace SocialNetwork.Application.DTOs.Score
{
    public class UserScore
    {
        public int Score { get; set; }
        public UserResponse User { get; set; }
        public UserScore(int Score, UserResponse user)
        {
            this.Score = Score;
            this.User = user;
        }
    }
}
