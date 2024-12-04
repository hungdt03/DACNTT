

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
    {
        public void Configure(EntityTypeBuilder<Notification> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(n => n.Recipient).WithMany().OnDelete(DeleteBehavior.NoAction);
        }
    }
}
