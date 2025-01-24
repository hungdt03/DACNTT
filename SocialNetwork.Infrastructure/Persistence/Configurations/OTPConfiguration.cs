
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class OTPConfiguration : IEntityTypeConfiguration<OTP>
    {
        public void Configure(EntityTypeBuilder<OTP> builder)
        {
            builder.HasKey(x => x.Id);
            builder.HasOne(x => x.User).WithMany(u => u.OTPs).HasForeignKey(x => x.UserId);
        }
    }
}
