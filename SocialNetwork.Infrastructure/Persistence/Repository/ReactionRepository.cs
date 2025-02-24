
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.DTOs.Admin;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class ReactionRepository : IReactionRepository
    {
        private readonly AppDbContext appDbContext;

        public ReactionRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public async Task<int> CountReactionsByPostId(Guid postId)
        {
            return await appDbContext
                .Reactions.Where(r => r.PostId == postId).CountAsync();
        }

        public async Task<int> CountReactionsByUserIdAsync(string userId)
        {
            return await appDbContext.Reactions
                .Where(r => r.UserId == userId).CountAsync();
        }

        public async Task CreateReactionAsync(Reaction reaction)
        {
            await appDbContext.Reactions.AddAsync(reaction);
        }

        public async Task<List<Reaction>> GetAllReactionsByPostIdAsync(Guid postId)
        {
            return await appDbContext.Reactions
                .Include(r => r.User)
                .Where(r => r.PostId == postId)
                .ToListAsync();
        }

        public async Task<Reaction?> GetReactionByPostIdAndUserIdAsync(Guid postId, string userId)
        {
            return await appDbContext.Reactions
                .SingleOrDefaultAsync(s => s.UserId == userId && s.PostId == postId);
        }

        public async Task<List<TopReactionWeek>> GetTopReactionInWeekly()
        {
            var weekAgo = DateTimeOffset.UtcNow.Date.AddDays(-6).Date; // Lấy đủ 7 ngày (tính cả hôm nay)
            var today = DateTimeOffset.UtcNow.Date;

            return await appDbContext.Reactions
                .Where(r => r.DateCreated.Date >= weekAgo && r.DateCreated.Date <= today)
                .GroupBy(r => new { Date = r.DateCreated.Date, Type = r.Type }) // Nhóm theo ngày + loại reaction
                .Select(g => new TopReactionWeek()
                {
                    Date = g.Key.Date,
                    Type = g.Key.Type,
                    Count = g.Count()
                })
                .OrderBy(g => g.Date) // Sắp xếp theo ngày
                .ToListAsync();
        }

        public void RemoveRange(IEnumerable<Reaction> reactions)
        {
            appDbContext.Reactions.RemoveRange(reactions);
        }

        public void RemoveReaction(Reaction reaction)
        {
            appDbContext.Reactions.Remove(reaction);
        }
    }
}
