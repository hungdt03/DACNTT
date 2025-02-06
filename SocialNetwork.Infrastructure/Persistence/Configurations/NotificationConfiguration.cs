

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(n => n.Recipient).WithMany().OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(n => n.Story).WithMany().HasForeignKey(f => f.StoryId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(n => n.Post).WithMany().HasForeignKey(f => f.PostId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(n => n.Comment).WithMany().HasForeignKey(f => f.CommentId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(n => n.FriendRequest).WithMany().HasForeignKey(f => f.FriendRequestId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(n => n.Group).WithMany().HasForeignKey(f => f.GroupId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(n => n.GroupInvitation).WithMany().HasForeignKey(f => f.GroupInvitationId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(n => n.Report).WithMany().HasForeignKey(f => f.ReportId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
