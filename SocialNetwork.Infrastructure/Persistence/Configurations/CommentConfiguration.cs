

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class CommentConfiguration : IEntityTypeConfiguration<Comment>
    {
        public void Configure(EntityTypeBuilder<Comment> builder)
        {
            builder.HasKey(c => c.Id);

            builder.HasOne(c => c.User)
                   .WithMany(u => u.Comments)
                   .HasForeignKey(c => c.UserId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(c => c.Post)
                   .WithMany(p => p.Comments)
                   .HasForeignKey(c => c.PostId)
                   .OnDelete(DeleteBehavior.NoAction);  

            builder.HasMany(c => c.Replies)
                .WithOne(c => c.ParentComment)
                   .HasForeignKey(c => c.ParentCommentId)
                   .OnDelete(DeleteBehavior.Restrict); 
        }
    }
}
