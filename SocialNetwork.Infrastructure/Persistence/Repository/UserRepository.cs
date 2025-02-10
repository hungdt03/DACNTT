using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task DeleteUserPermanentlyByEmail(string email)
        {
            await _context.Database.ExecuteSqlRawAsync("DELETE FROM AspNetUsers WHERE Email = {0}", email);
        }

        public async Task<User?> GetUserByEmailIgnoreQuery(string email)
        {
            return await _context
                .Users
                .IgnoreQueryFilters()   
                .SingleOrDefaultAsync(u => u.Email == email);
        }


        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users
                .ToListAsync();
        }

        public async Task<(IEnumerable<User> Users, int TotalCount)> GetAllUsersContainsKeyAsync(string key, int page, int size)
        {
            var query = _context.Users
                .Where(u => u.FullName.ToLower().Contains(key))
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var users = await query
                .Skip((page - 1) * size)
                .Take(size)
                .Include(u => u.Posts)
                .Include(u => u.Followers)
                .Include(u => u.Followings)
                .ToListAsync();

            return (users, totalCount);
        }

        public async Task<User?> GetUserByIdAsync(string userId)
        {
            return await _context.Users
                .Include(u => u.Posts)
                .Include(u => u.Followers)
                .Include(u => u.Followings)
                .SingleOrDefaultAsync(u => u.Id == userId);
        }
    }
}
