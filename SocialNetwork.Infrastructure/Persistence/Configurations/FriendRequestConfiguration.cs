using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class FriendRequestConfiguration : IEntityTypeConfiguration<FriendRequest>
    {
        public void Configure(EntityTypeBuilder<FriendRequest> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(fr => fr.Sender).WithMany(u => u.RequestSends).HasForeignKey(u => u.SenderId).OnDelete(DeleteBehavior.NoAction); 
            builder.HasOne(fr => fr.Receiver).WithMany(u => u.RequestReceives).HasForeignKey(u => u.ReceiverId).OnDelete(DeleteBehavior.NoAction); 
        }
    }
}
