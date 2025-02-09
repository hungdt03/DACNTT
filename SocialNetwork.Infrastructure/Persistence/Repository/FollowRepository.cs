﻿
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.UserInfo;
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

        public async Task<(IEnumerable<Follow> Follows, int TotalCount)> GetAllFolloweesByUserIdAsync(string userId, int page, int size)
        {
            var queryable = _context.Follows.Where(s => s.FollowerId == userId);
            var totalCount = await queryable.CountAsync();

            var follows = await queryable
                .Skip((page - 1) * size)
                .Take(size)
                 .Include(f => f.Followee)
                .ToListAsync();

            return (follows, totalCount);
        }

        public async Task<(IEnumerable<Follow> Follows, int TotalCount)> GetAllFollowersByUserIdAsync(string userId, int page, int size)
        {
            var queryable = _context.Follows.Where(s => s.FolloweeId == userId);
            var totalCount = await queryable.CountAsync();

            var follows = await queryable
                .Skip((page - 1) * size)
                .Take(size)
                 .Include(f => f.Follower)
                .ToListAsync();

            return (follows, totalCount);
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
