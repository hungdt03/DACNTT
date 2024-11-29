using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class FriendConfiguration : IEntityTypeConfiguration<Friend>
    {
        public void Configure(EntityTypeBuilder<Friend> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(f => f.FirstUser).WithMany(f => f.Friends).HasForeignKey(f => f.FirstUserId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(f => f.LastUser).WithMany().HasForeignKey(f => f.LastUserId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
