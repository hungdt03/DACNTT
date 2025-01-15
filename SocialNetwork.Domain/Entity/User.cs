using Microsoft.AspNetCore.Identity;

namespace SocialNetwork.Domain.Entity
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        public string? Bio {  get; set; }
        public string Avatar { get; set; }
        public string? CoverImage { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public bool IsVerification {  get; set; }
        public DateTimeOffset DateOfBirth { get; set; }    
        public DateTimeOffset DateJoined { get; set; }

        // NAVIGATION PROPERTIES
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Reaction> Reactions { get; set; }
        public ICollection<FriendShip> RequestSends { get; set; }
        public ICollection<FriendShip> RequestReceives { get; set; }
        public ICollection<Post> Posts { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<ChatRoomMember> ChatRoomMembers { get; set; }
        public ICollection<Message> Messages { get; set; }
        public ICollection<MessageReadStatus> MessageReadStatuses { get; set; }
        public ICollection<Follow> Followers { get; set; }
        public ICollection<Follow> Followings { get; set; }
        public ICollection<Story> Stories { get; set; }
        public ICollection<OTP> OTPs { get; set; }
        public ICollection<RefreshToken> RefreshTokens { get; set; }
    }
}
