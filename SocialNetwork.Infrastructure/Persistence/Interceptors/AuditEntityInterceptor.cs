using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SocialNetwork.Domain.Abstractions;

namespace SocialNetwork.Infrastructure.Persistence.Interceptors
{
    public class AuditEntityInterceptor : ISaveChangesInterceptor
    {
        public AuditEntityInterceptor()
        {
        }

        public InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
        {
            return result;
        }

        public ValueTask<InterceptionResult<int>> SavingChangesAsync(
            DbContextEventData eventData,
            InterceptionResult<int> result,
            CancellationToken cancellationToken = default)
        {
            AddAuditInfo(eventData.Context);
            return new ValueTask<InterceptionResult<int>>(result);
        }

        private static void AddAuditInfo(DbContext? context)
        {
            if (context == null) return;

            var entries = context.ChangeTracker.Entries()
                .Where(e => e.Entity is BaseAuditableEntity &&
                            (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (BaseAuditableEntity)entry.Entity;
                var now = DateTimeOffset.UtcNow;

                if (entry.State == EntityState.Added)
                {
                    entity.DateCreated = now;
                }

                if (entry.State == EntityState.Modified)
                {
                    entity.DateUpdated = now;
                }
            }
        }
    }
}
