

using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface IReportRepository
    { 
        Task CreateNewReportAsync(Report report);
        Task<(List<Report> Reports, int TotalCount)> GetAllPendingReportsByGroupIdAsync(Guid groupId, int page, int size);
        Task<Report?> GetReportByIdAsync(Guid id);
        Task<int> CountPendingReportsByGroupIdAsync(Guid groupId);
        void RemoveReport(Report report);
        Task<List<Report>> GetAllReports();
        Task DeleteOneReport(Guid id);
        Task DeleteManyReport(List<string> id);
        Task DeleteAllReport();
        Task UpdateReport(Guid id, string newStatus);
    }
}
