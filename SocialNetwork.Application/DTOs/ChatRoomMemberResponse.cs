

namespace SocialNetwork.Application.DTOs
{
    public class ChatRoomMemberResponse
    {
        public UserResponse User { get; set; }
        public bool IsAccepted { get; set; }
    }
}
