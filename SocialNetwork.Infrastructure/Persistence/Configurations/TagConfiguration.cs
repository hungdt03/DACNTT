
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class TagConfiguration : IEntityTypeConfiguration<Tag>
    {
        public void Configure(EntityTypeBuilder<Tag> builder)
        {
            builder.HasKey(t => t.Id);
            builder.HasOne(t => t.User).WithMany(u => u.Tags).HasForeignKey(t => t.UserId);
            builder.HasOne(t => t.Post).WithMany(u => u.Tags).HasForeignKey(t => t.PostId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
