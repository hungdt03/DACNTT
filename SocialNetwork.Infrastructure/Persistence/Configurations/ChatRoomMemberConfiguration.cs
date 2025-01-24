
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.ChatRoomInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class ChatRoomMemberConfiguration : IEntityTypeConfiguration<ChatRoomMember>
    {
        public void Configure(EntityTypeBuilder<ChatRoomMember> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(cr => cr.User).WithMany(u => u.ChatRoomMembers).HasForeignKey(u => u.UserId);
            builder.HasOne(cr => cr.ChatRoom).WithMany(u => u.Members).HasForeignKey(u => u.ChatRoomId);
        }
    }
}
