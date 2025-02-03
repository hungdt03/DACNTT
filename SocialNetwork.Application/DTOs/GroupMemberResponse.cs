
namespace SocialNetwork.Application.DTOs
{
    public class GroupMemberResponse
    {
        public Guid Id { get; set; }
        public UserResponse User { get; set; }
        public string Role { get; set; }
        public DateTimeOffset JoinDate { get; set; }
    }
}
