
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class ChatRoomConfiguration : IEntityTypeConfiguration<ChatRoom>
    {
        public void Configure(EntityTypeBuilder<ChatRoom> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasMany(c => c.Messages).WithOne(c => c.ChatRoom).HasForeignKey(c => c.ChatRoomId);
            builder.HasMany(c => c.Members).WithOne(c => c.ChatRoom).HasForeignKey(c => c.UserId);
        }
    }
}
