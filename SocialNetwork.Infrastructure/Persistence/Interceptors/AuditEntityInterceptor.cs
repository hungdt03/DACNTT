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
            ProcessEntities(eventData.Context);
            return new ValueTask<InterceptionResult<int>>(result);
        }

        private static void ProcessEntities(DbContext? context)
        {
            if (context == null) return;

            var now = DateTimeOffset.UtcNow;

            foreach (var entry in context.ChangeTracker.Entries())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        if (entry.Entity is BaseAuditableEntity auditableEntity)
                        {
                            auditableEntity.DateCreated = now;
                        }
                        break;

                    case EntityState.Modified:
                        if (entry.Entity is BaseAuditableEntity modifiedEntity)
                        {
                            modifiedEntity.DateUpdated = now;
                        }
                        break;

                    case EntityState.Deleted:
                        if (entry.Entity is ISoftDelete softDeleteEntity)
                        {
                            entry.State = EntityState.Modified; // Chuyển sang Modified để không bị xóa cứng
                            softDeleteEntity.IsDeleted = true;
                            softDeleteEntity.DeletedAt = now;
                        }
                        break;
                }
            }
        }

    }
}
