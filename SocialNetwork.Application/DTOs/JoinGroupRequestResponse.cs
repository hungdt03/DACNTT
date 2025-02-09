
namespace SocialNetwork.Application.DTOs
{
    public class JoinGroupRequestResponse
    { 
        public Guid Id { get; set; }
        public UserResponse User { get; set; }
        public DateTimeOffset RequestDate { get; set; }
        public bool IsApproval { get; set; }
    }
}
