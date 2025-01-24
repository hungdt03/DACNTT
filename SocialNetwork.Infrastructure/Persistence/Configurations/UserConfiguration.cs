using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasMany(u => u.MessageReadStatuses).WithOne(p => p.User).HasForeignKey(u => u.UserId);
            builder.HasMany(u => u.RefreshTokens).WithOne(p => p.User).HasForeignKey(u => u.UserId);
            builder.HasMany(u => u.OTPs).WithOne(p => p.User).HasForeignKey(x => x.UserId); 
            builder.HasMany(u => u.Schools).WithOne(p => p.User).HasForeignKey(x => x.UserId);
            builder.HasMany(u => u.UserSocialLinks).WithOne(p => p.User).HasForeignKey(x => x.UserId);
            builder.HasMany(u => u.WorkPlaces).WithOne(p => p.User).HasForeignKey(x => x.UserId);
            builder.HasMany(u => u.Reports).WithOne(p => p.Reporter).HasForeignKey(x => x.ReporterId);

            builder.HasMany(u => u.InvitationReceives).WithOne(u => u.Invitee).HasForeignKey(u => u.InviteeId).OnDelete(DeleteBehavior.NoAction);
            builder.HasMany(u => u.InvitationSends).WithOne(u => u.Inviter).HasForeignKey(u => u.InviterId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
