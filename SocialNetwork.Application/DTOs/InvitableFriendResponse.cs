
namespace SocialNetwork.Application.DTOs
{
    public class InvitableFriendResponse
    {
        public FriendResponse Friend { get; set; }
        public bool IsMember { get; set; }
        public bool HaveInvited { get; set; }
    }
}
