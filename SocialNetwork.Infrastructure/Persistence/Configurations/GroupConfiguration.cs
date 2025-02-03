
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class GroupConfiguration : IEntityTypeConfiguration<Group>
    {
        public void Configure(EntityTypeBuilder<Group> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasMany(x => x.Members).WithOne(z => z.Group).HasForeignKey(x => x.GroupId);
            builder.HasMany(x => x.Posts).WithOne(z => z.Group).HasForeignKey(x => x.GroupId);
            builder.HasMany(x => x.Invites).WithOne(z => z.Group).HasForeignKey(x => x.GroupId);
            builder.HasMany(x => x.Reports).WithOne(z => z.Group).HasForeignKey(x => x.GroupId);
        }
    }
}
