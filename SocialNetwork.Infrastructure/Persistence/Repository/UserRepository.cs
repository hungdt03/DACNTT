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

        public async Task<IEnumerable<User>> GetAllUsersContainsKeyAsync(string key)
        {
            return await _context.Users
                .Where(u => u.FullName.ToLower().Contains(key.ToLower()))
                  .Include(u => u.Posts)
                .Include(u => u.Followers)
                .Include(u => u.Followings)
                .ToListAsync();
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
