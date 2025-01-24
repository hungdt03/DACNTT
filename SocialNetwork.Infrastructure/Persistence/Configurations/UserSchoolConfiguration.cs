
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class UserSchoolConfiguration : IEntityTypeConfiguration<UserSchool>
    {
        public void Configure(EntityTypeBuilder<UserSchool> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.School).WithMany().HasForeignKey(x => x.SchoolId);
        }
    }
}
