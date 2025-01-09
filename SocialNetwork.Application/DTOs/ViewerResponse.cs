
namespace SocialNetwork.Application.DTOs
{
    public class ViewerResponse
    {
        public UserResponse User { get; set; }
        public List<string> Reactions { get; set; }
    }
}
