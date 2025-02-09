

namespace SocialNetwork.Application.DTOs
{
    public class GroupRoleInvitationResponse
    {
        public Guid Id { get; set; }
        public GroupResponse Group { get; set; }
        public UserResponse Inviter { get; set; }
        public UserResponse Invitee { get; set; }
        public string Role { get; set; }
    }
}
