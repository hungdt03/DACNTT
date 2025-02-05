
namespace SocialNetwork.Application.DTOs
{
    public class GroupMemberResponse
    {
        public Guid Id { get; set; }
        public UserResponse User { get; set; }
        public string Role { get; set; }
        public DateTimeOffset JoinDate { get; set; }
        public bool IsInvitedAsAdmin { get; set; }
        public bool IsInvitedAsModerator { get; set; }
        public Guid? InvitationId { get; set; }
    }
}
