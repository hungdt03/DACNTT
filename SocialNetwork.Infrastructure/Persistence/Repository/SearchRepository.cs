
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Domain.Entity.UserInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class SearchRepository : ISearchRepository
    {
        private readonly AppDbContext _context;

        public SearchRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task CreateSearchHistoryAsync(SearchHistory searchHistory)
        {
            await _context.SearchHistories.AddAsync(searchHistory);
        }

        public async Task<(List<SearchHistory> Histories, int TotalCount)> GetAllSearchHistoryByUserIdAsync(string userId, int page, int size)
        {
            var queryable = _context.SearchHistories
                .Where(x => x.UserId == userId);

            var totalCount = await queryable.CountAsync();

            var histories = await queryable
                .OrderByDescending(x => x.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .Include(x => x.SearchUser)
                .Include(x => x.SearchGroup)
                .ToListAsync();

            return (histories, totalCount);
        }

        public async Task<List<SearchHistory>> GetAllSearchHistoryByUserIdAsync(string userId)
        {
            return await _context.SearchHistories
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<SearchHistory?> GetSearchHistoryByGroupIdAndUserId(Guid groupId, string userId)
        {
            return await _context.SearchHistories
                .SingleOrDefaultAsync(s => s.SearchGroupId == groupId && s.UserId == userId);
        }

        public async Task<SearchHistory?> GetSearchHistoryBySearchUserIdAndUserId(string searchUserId, string userId)
        {
            return await _context.SearchHistories
               .SingleOrDefaultAsync(s => s.SearchUserId == searchUserId && s.UserId == userId);
        }

        public async Task<SearchHistory?> GetSearchHistoryByTextAndUserId(string text, string userId)
        {
            return await _context.SearchHistories
               .SingleOrDefaultAsync(s => s.SearchText == text && s.UserId == userId);
        }

        public async Task<SearchHistory?> GetSearchHistoryByUserIdAndId(string userId, Guid id)
        {
            return await _context.SearchHistories
                .SingleOrDefaultAsync(s => s.Id == id && s.UserId == userId);
        }

        public void RemoveRange(IEnumerable<SearchHistory> searchHistories)
        {
            _context.SearchHistories.RemoveRange(searchHistories);
        }

        public void RemoveSearchHistory(SearchHistory searchHistory)
        {
            _context.SearchHistories.Remove(searchHistory);
        }
    }
}
