

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class JoinGroupRequestConfiguration : IEntityTypeConfiguration<JoinGroupRequest>
    {
        public void Configure(EntityTypeBuilder<JoinGroupRequest> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Group).WithMany().HasForeignKey(x => x.GroupId);
            builder.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
        }
    }
}
