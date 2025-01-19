

using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class FollowRepository : IFollowRepository
    {

        private readonly AppDbContext _context;

        public FollowRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CountFolloweesByUserIdAsync(string userId)
        {
            return await _context.Follows
                .Where(d => d.FollowerId == userId)
                .CountAsync();
        }

        public async Task<int> CountFollowersByUserIdAsync(string userId)
        {
            return await _context.Follows
                .Where(d => d.FolloweeId == userId)
                .CountAsync();
        }

        public async Task CreateFollowAsync(Follow follow)
        {
            await _context.Follows.AddAsync(follow);
        }

        public void DeleteFollow(Follow follow)
        {
            _context.Follows.Remove(follow);
        }

        public async Task<IEnumerable<Follow>> GetAllFolloweesByUserIdAsync(string userId)
        {
            return await _context.Follows
                  .Include(f => f.Followee)
                .Where(s => s.FollowerId == userId).ToListAsync();
        }

        public async Task<IEnumerable<Follow>> GetAllFollowersByUserIdAsync(string userId)
        {
            return await _context.Follows
                .Include(f => f.Follower)
                .Where(s => s.FolloweeId == userId).ToListAsync();
        }

        public async Task<Follow?> GetFollowByFollowerIdAndFolloweeIdAsync(string followerId, string followeeId)
        {
            return await _context.Follows
                .Include(f => f.Follower)
                .Include(f => f.Followee)
                .SingleOrDefaultAsync(f => f.FollowerId == followerId && f.FolloweeId == followeeId);
        }
    }
}
