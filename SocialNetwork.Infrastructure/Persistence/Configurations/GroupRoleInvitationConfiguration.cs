using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class GroupRoleInvitationConfiguration : IEntityTypeConfiguration<GroupRoleInvitation>
    {
        public void Configure(EntityTypeBuilder<GroupRoleInvitation> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Invitee).WithMany().HasForeignKey(x => x.InviteeId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(x => x.Inviter).WithMany().HasForeignKey(x => x.InviterId).OnDelete(DeleteBehavior.NoAction);
            builder.HasOne(x => x.Group).WithMany(g => g.RoleInvitations).HasForeignKey(x => x.GroupId).OnDelete(DeleteBehavior.NoAction);
        }
    }
}
