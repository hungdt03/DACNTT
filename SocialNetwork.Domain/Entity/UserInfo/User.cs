using Microsoft.AspNetCore.Identity;
using SocialNetwork.Domain.Entity.ChatRoomInfo;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Domain.Entity.MessageInfo;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Domain.Entity.System
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }
        public string? Bio { get; set; }
        public string Avatar { get; set; }
        public string? CoverImage { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public bool IsVerification { get; set; }
        public DateTimeOffset DateOfBirth { get; set; }
        public DateTimeOffset DateJoined { get; set; }
       
        public Guid? LocationId { get; set; }
        public Guid? HometownId { get; set; }

        // NAVIGATION PROPERTIES
        public Location? Location { get; set; }
        public Location? HomeTown { get; set; }

        public ICollection<SearchHistory> Searches { get; set; }
        public ICollection<BlockList> BlockLists { get; set; }
        public ICollection<Report> Reports { get; set; }
        public ICollection<UserSchool> Schools { get; set; }
        public ICollection<UserWorkPlace> WorkPlaces { get; set; }
        public ICollection<UserSocialLink> UserSocialLinks { get; set; }
        public ICollection<GroupInvitation> InvitationSends { get; set; }
        public ICollection<GroupInvitation> InvitationReceives { get; set; }
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
