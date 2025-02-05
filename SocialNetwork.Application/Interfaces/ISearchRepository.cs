

using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface ISearchRepository
    { 
        Task CreateSearchHistoryAsync(SearchHistory searchHistory);
        Task<(List<SearchHistory> Histories, int TotalCount)> GetAllSearchHistoryByUserIdAsync(string userId, int page, int size);
        Task<List<SearchHistory>> GetAllSearchHistoryByUserIdAsync(string userId);
        Task<SearchHistory?> GetSearchHistoryByUserIdAndId(string userId, Guid id);
        Task<SearchHistory?> GetSearchHistoryBySearchUserIdAndUserId(string searchUserId, string userId);
        Task<SearchHistory?> GetSearchHistoryByGroupIdAndUserId(Guid groupId, string userId);
        Task<SearchHistory?> GetSearchHistoryByTextAndUserId(string text, string userId);
        void RemoveSearchHistory(SearchHistory searchHistory);
        void RemoveRange(IEnumerable<SearchHistory> searchHistories);
    }
}
