using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;


namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class PostConfiguration : IEntityTypeConfiguration<Post>
    {
        public void Configure(EntityTypeBuilder<Post> builder)
        {
            builder.HasKey(p => p.Id);
            builder.HasMany(p => p.Medias).WithOne(c => c.Post).HasForeignKey(c => c.PostId);
            builder.HasOne(p => p.User).WithMany(c => c.Posts).HasForeignKey(c => c.UserId);
            builder.HasOne(p => p.SharePost)
              .WithMany(p => p.Shares) 
              .HasForeignKey(p => p.SharePostId).OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(p => p.Comments).WithOne(c => c.Post).HasForeignKey(c => c.PostId).OnDelete(DeleteBehavior.NoAction);
            builder.HasMany(p => p.Reactions).WithOne(c => c.Post).HasForeignKey(c => c.PostId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
