
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class ReactionConfiguration : IEntityTypeConfiguration<Reaction>
    {
        public void Configure(EntityTypeBuilder<Reaction> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(r => r.Post).WithMany(p => p.Reactions).HasForeignKey(r => r.PostId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(r => r.User).WithMany(p => p.Reactions).HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
