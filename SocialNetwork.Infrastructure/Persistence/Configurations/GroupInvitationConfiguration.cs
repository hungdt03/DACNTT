
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class GroupInvitationConfiguration : IEntityTypeConfiguration<GroupInvitation>
    {
        public void Configure(EntityTypeBuilder<GroupInvitation> builder)
        {
            builder.HasKey(x => x.Id);
            //builder.HasOne(g => g.Invitee)
            //    .WithMany()
            //    .HasForeignKey(g => g.InviteeId);

            //builder.HasOne(g => g.Inviter)
            //    .WithMany()
            //    .HasForeignKey(g => g.InviterId);
        }
    }
}
