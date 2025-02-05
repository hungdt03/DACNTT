

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class SearchHistoryConfiguration : IEntityTypeConfiguration<SearchHistory>
    {
        public void Configure(EntityTypeBuilder<SearchHistory> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.User).WithMany(t => t.Searches).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(x => x.SearchUser).WithMany().HasForeignKey(x => x.SearchUserId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(x => x.SearchGroup).WithMany().HasForeignKey(x => x.SearchGroupId).OnDelete(DeleteBehavior.NoAction);

        }
    }
}
