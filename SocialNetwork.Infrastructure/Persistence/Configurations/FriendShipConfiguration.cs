using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class FriendShipConfiguration : IEntityTypeConfiguration<FriendShip>
    {
        public void Configure(EntityTypeBuilder<FriendShip> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(fr => fr.User).WithMany(u => u.RequestSends).HasForeignKey(u => u.UserId).OnDelete(DeleteBehavior.NoAction); 
            builder.HasOne(fr => fr.Friend).WithMany(u => u.RequestReceives).HasForeignKey(u => u.FriendId).OnDelete(DeleteBehavior.NoAction); 
        }
    }
}
