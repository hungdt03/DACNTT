

namespace SocialNetwork.Application.DTOs.Admin
{
    public class UserFollow
    {
        public UserResponse User { get; set; }
        public int Follow {  get; set; }

        public UserFollow(UserResponse user, int follow)
        {
            User = user;
            Follow = follow;
        }
    }
}
