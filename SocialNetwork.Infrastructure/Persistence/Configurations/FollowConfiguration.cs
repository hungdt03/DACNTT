
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class FollowConfiguration : IEntityTypeConfiguration<Follow>
    {
        public void Configure(EntityTypeBuilder<Follow> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(f => f.Follower).WithMany(u => u.Followings).HasForeignKey(u => u.FollowerId).OnDelete(DeleteBehavior.NoAction); ;
            builder.HasOne(f => f.Followee).WithMany(u => u.Followers).HasForeignKey(u => u.FolloweeId).OnDelete(DeleteBehavior.NoAction); ;
        }
    }
}
