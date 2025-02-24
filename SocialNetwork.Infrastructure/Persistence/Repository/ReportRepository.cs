
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;
using System;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class ReportRepository : IReportRepository
    {
        private readonly AppDbContext _context;

        public ReportRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CountPendingReportsByGroupIdAsync(Guid groupId)
        {
            return await _context.Reports
                .Where(r => r.Status == ReportStatus.PENDING && r.GroupId == groupId).CountAsync();
        }

        public async Task CreateNewReportAsync(Report report)
        {
            await _context.Reports.AddAsync(report);    
        }

        public async Task<(List<Report> Reports, int TotalCount)> GetAllPendingReportsByGroupIdAsync(Guid groupId, int page, int size)
        {
            var queryable = _context.Reports
                .Include(report => report.Reporter)
                 .Include(report => report.TargetPost)
                    .ThenInclude(r => r.User)
                .Include(report => report.TargetPost)
                    .ThenInclude(r => r.Medias)
                .Include(report => report.TargetPost)
                    .ThenInclude(r => r.Tags)
                        .ThenInclude(r => r.User)
                .Include(report => report.TargetComment)
                    .ThenInclude(r => r.User)
                .Include(report => report.TargetUser)
                .Where(r => 
                    r.GroupId == groupId && 
                   (
                     (r.ReportType == ReportType.POST && r.TargetPost != null)
                     || (r.ReportType == ReportType.COMMENT && r.TargetComment != null)
                     || (r.ReportType == ReportType.USER && r.TargetUser != null)
                   )
                    && r.Status == ReportStatus.PENDING
                );
            var totalCount = await queryable.CountAsync();  

            var reports = await queryable
                .OrderByDescending(r => r.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                 
               .ToListAsync();

            return (reports, totalCount);
        }

        public async Task<Report?> GetReportByIdAsync(Guid id)
        {
            return await _context.Reports
                 .Include(r => r.TargetGroup)
                    //.IgnoreQueryFilters()
                 .Include(r => r.TargetComment)
                    .ThenInclude(r => r.User)
                    //.IgnoreQueryFilters()
                 .Include(r => r.TargetPost)
                    .ThenInclude(r => r.User)
                    //.IgnoreQueryFilters()
                 .Include(r => r.TargetUser)
                    //.IgnoreQueryFilters()
                 .Include(r => r.Reporter)
                 .SingleOrDefaultAsync(r => r.Id == id);
        }
        public async Task<Report?> GetReportByIdIgnoreAsync(Guid id)
        {
            return await _context.Reports
                  .Where(r => r.GroupId == null)
                   .IgnoreQueryFilters()
                 .Include(r => r.TargetGroup)
                    .IgnoreQueryFilters()
                 .Include(r => r.TargetComment)
                    .ThenInclude(r => r.User)
                    .IgnoreQueryFilters()
                 .Include(r => r.TargetPost)
                    .ThenInclude(r => r.User)
                    .IgnoreQueryFilters()
                 .Include(r => r.TargetUser)
                    .IgnoreQueryFilters()
                 .Include(r => r.Reporter)
                 .SingleOrDefaultAsync(r => r.Id == id);
        }

        public void RemoveReport(Report report)
        {
            _context.Reports.Remove(report);
        }
        public async Task<List<Report>> GetAllReports()
        {
            return await _context.Reports
                    .Where(r => r.GroupId == null)
                .Include(r => r.TargetGroup)
                .Include(r => r.TargetComment)
                    .ThenInclude(r => r.User)
                  .IgnoreQueryFilters()
                .Include(r => r.TargetPost)
                    .ThenInclude(r => r.User)
                     .IgnoreQueryFilters()
                .Include(r => r.TargetUser)
                    .IgnoreQueryFilters()
                .Include(r => r.Reporter)
                .ToListAsync();
        }
        public async Task<(List<Report> Reports, int TotalCount)> GetAllReportsIgnore(int page, int size, string status, string type)
        {
            var query = _context.Reports
                    .Where(r => r.GroupId == null);

            if(type != "ALL")
            {
                query = type switch
                {
                    ReportType.GROUP => query.Where(p => p.ReportType == ReportType.GROUP),
                    ReportType.COMMENT => query.Where(p => p.ReportType == ReportType.COMMENT),
                    ReportType.USER => query.Where(p => p.ReportType == ReportType.USER),
                    ReportType.POST => query.Where(p => p.ReportType == ReportType.POST),
                    _ => query
                };
            }

            if(status != null)
            {
                query = status switch
                {
                    ReportStatus.PENDING => query.Where(p => p.Status == ReportStatus.PENDING),
                    ReportStatus.RESOLVED => query.Where(p => p.Status == ReportStatus.RESOLVED),
                    ReportStatus.REJECTED => query.Where(p => p.Status == ReportStatus.REJECTED),
                    _ => query
                };
            }

            var totalCount = await query.CountAsync();

            var reports = await query
             .Include(r => r.TargetGroup)
             .Include(r => r.TargetComment)
                 .ThenInclude(c => c.User) 
             .Include(r => r.TargetPost)
                 .ThenInclude(p => p.User)  
             .Include(r => r.TargetUser)
             .Include(r => r.Reporter)
             .OrderByDescending(r => r.DateCreated)
             .Skip((page - 1) * size)
             .Take(size)
            .ToListAsync();

            return (reports, totalCount);
        }

        public async Task DeleteOneReport(Guid id)
        {
            await _context.Reports
                .Where(r => r.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(r => r.IsDeleted, true)
                    .SetProperty(r => r.DeletedAt, DateTime.UtcNow)
                );
        }


        public async Task DeleteManyReport(List<string> ids)
        {
            var guidIds = ids.Select(Guid.Parse).ToList();

            await _context.Reports
                .Where(r => guidIds.Contains(r.Id))
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(r => r.IsDeleted, true)
                    .SetProperty(r => r.DeletedAt, DateTime.UtcNow)
                );
        }

        public async Task DeleteAllReport()
        {
            await _context.Reports
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(r => r.IsDeleted, true)
                    .SetProperty(r => r.DeletedAt, DateTime.UtcNow)
                );
        }

        public async Task UpdateReport(Guid id, string newStatus, string newReportSolution)
        {
            var report = await GetReportByIdAsync(id);
            if (report == null) { return; }
            report.Status = newStatus;
            report.ResolutionNotes = newReportSolution;
            report.DateUpdated = DateTimeOffset.UtcNow;
            report.ResolvedAt = DateTimeOffset.UtcNow;
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();
        }

        public async Task<int> CountAllReport()
        {
            return await _context.Reports.CountAsync();
        }
    }
}
