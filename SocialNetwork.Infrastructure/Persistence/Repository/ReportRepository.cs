
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

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
            var queryable = _context.Reports.Where(r => r.GroupId == groupId && r.Status == ReportStatus.PENDING);
            var totalCount = await queryable.CountAsync();  

            var reports = await queryable
                .OrderByDescending(r => r.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
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
                .Include(report => report.TargetGroup)
               .ToListAsync();

            return (reports, totalCount);
        }

        public async Task<Report?> GetReportByIdAsync(Guid id)
        {
            return await _context.Reports
                 .SingleOrDefaultAsync(r => r.Id == id);
        }

        public void RemoveReport(Report report)
        {
            _context.Reports.Remove(report);
        }
        public async Task<List<Report>> GetAllReports()
        {
            return await _context.Reports
                .Include(r=>r.TargetGroup)
                .Include(r => r.TargetComment)
                .Include(r => r.TargetPost)
                .Include(r => r.TargetUser)
                .Include(r => r.Reporter)
                .ToListAsync();
        }

        public async Task DeleteOneReport(Guid id)
        {
            await _context.Reports.Where(r=>r.Id.Equals(id)).ExecuteDeleteAsync();
        }

        public async Task DeleteManyReport(List<string> id)
        {
            await _context.Reports
                .Where(u => id.Contains(u.Id.ToString()))
                .ExecuteDeleteAsync();
        }

        public async Task DeleteAllReport()
        {
            await _context.Reports.ExecuteDeleteAsync();
        }
        public async Task UpdateReport(Guid id, string newStatus)
        {
            var report = await GetReportByIdAsync(id);
            if (report == null) { return; }
            report.Status = newStatus;
            _context.Reports.Update(report);
            _context.SaveChanges();
        }
    }
}
