
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class UserWorkPlaceConfiguration : IEntityTypeConfiguration<UserWorkPlace>
    {
        public void Configure(EntityTypeBuilder<UserWorkPlace> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.Position)
                .WithMany().HasForeignKey(x => x.PositionId);

            builder.HasOne(x => x.Company)
                .WithMany().HasForeignKey(x => x.CompanyId);
        }
    }
}
