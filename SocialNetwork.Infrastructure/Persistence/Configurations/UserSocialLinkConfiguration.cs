
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class UserSocialLinkConfiguration : IEntityTypeConfiguration<UserSocialLink>
    {
        public void Configure(EntityTypeBuilder<UserSocialLink> builder)
        {
            builder.HasKey(x => x.Id);  
        }
    }
}
