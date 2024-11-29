

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class MessageConfiguration : IEntityTypeConfiguration<Message>
    {
        public void Configure(EntityTypeBuilder<Message> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasMany(m => m.Reads).WithOne(m => m.Message).HasForeignKey(m => m.MessageId);
            builder.HasMany(m => m.Medias).WithOne(m => m.Message).HasForeignKey(m => m.MessageId);
        }
    }
}
