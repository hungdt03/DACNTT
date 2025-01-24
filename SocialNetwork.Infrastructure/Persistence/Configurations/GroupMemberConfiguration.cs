
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class GroupMemberConfiguration : IEntityTypeConfiguration<GroupMember>
    {
        public void Configure(EntityTypeBuilder<GroupMember> builder)
        {
            builder.HasKey(x => x.Id);
        }
    }
}
