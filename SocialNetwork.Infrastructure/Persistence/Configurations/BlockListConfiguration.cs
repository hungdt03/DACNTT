

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class BlockListConfiguration : IEntityTypeConfiguration<BlockList>
    {
        public void Configure(EntityTypeBuilder<BlockList> builder)
        {
            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Blocker).WithMany(x => x.BlockLists).HasForeignKey(x => x.BlockerId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(x => x.Blockee).WithMany().HasForeignKey(x => x.BlockeeId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
