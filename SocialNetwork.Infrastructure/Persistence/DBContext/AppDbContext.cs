
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Domain.Entity.ChatRoomInfo;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Domain.Entity.MessageInfo;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Infrastructure.DBContext
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }

        // USER ROOT
        public DbSet<User> Users { get; set; }
        public DbSet<FriendShip> FriendShips { get; set; }
        public DbSet<Follow> Follows { get; set; }
        public DbSet<BlockList> BlockLists { get; set; }
        public DbSet<UserSchool> UserSchools { get; set; }
        public DbSet<UserWorkPlace> UserWorkPlaces { get; set; }
        public DbSet<UserSocialLink> UserSocialLinks { get; set; }
        public DbSet<SearchHistory> SearchHistories { get; set; }

        // GROUP
        public DbSet<Group> Groups { get; set; }
        public DbSet<GroupInvitation> GroupInvitations { get; set; }
        public DbSet<GroupRoleInvitation> GroupRoleInvitations { get; set; }
        public DbSet<GroupMember> GroupMembers { get; set; }
        public DbSet<JoinGroupRequest> JoinGroupRequests { get; set; }

        // POST
        public DbSet<Post> Posts { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<PostMedia> PostMedias { get; set; }

        // CHATROOM
        public DbSet<ChatRoom> ChatRooms { get; set; }
        public DbSet<ChatRoomMember> ChatRoomMembers { get; set; }

        // MESSAGE
        public DbSet<Message> Messages { get; set; }
        public DbSet<MessageMedia> MessageMedias { get; set; }
        public DbSet<MessageReadStatus> MessageReadStatuses { get; set; }

        // STORY
        public DbSet<Story> Stories { get; set; }
        public DbSet<Viewer> Viewers { get; set; }

        // SYSTEM
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Privacy> Privacies { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<OTP> OTPs { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<School> Schools { get; set; }
        public DbSet<Position> Positions { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Profession> Professions { get; set; }
        public DbSet<Major> Majors { get; set; }

    }

}
