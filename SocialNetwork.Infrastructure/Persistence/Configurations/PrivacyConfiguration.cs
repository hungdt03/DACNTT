
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Infrastructure.Persistence.Configurations
{
    public class PrivacyConfiguration : IEntityTypeConfiguration<Privacy>
    {
        public void Configure(EntityTypeBuilder<Privacy> builder)
        {
            builder.HasKey(x => x.Id);
        }
    }
}
