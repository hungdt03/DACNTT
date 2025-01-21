

using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class StoryConfiguration : IEntityTypeConfiguration<Story>
    {
        public void Configure(EntityTypeBuilder<Story> builder)
        {
            builder.HasKey(t => t.Id);
            builder.HasOne(t => t.User).WithMany(u => u.Stories).HasForeignKey(t => t.UserId);
            builder.HasMany(t => t.Viewers).WithOne(u => u.Story).HasForeignKey(t => t.StoryId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
