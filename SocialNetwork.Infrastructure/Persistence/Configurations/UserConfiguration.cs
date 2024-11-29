using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasMany(u => u.MessageReadStatuses).WithOne(p => p.User).HasForeignKey(u => u.UserId);
            builder.HasMany(u => u.RefreshTokens).WithOne(p => p.User).HasForeignKey(u => u.UserId);
        }
    }
}
