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
        public async Task<List<User>> GetAllRoleUser()
        {
            var userRoleId = await _context.Roles
                .Where(r => r.Name == "USER")
                .Select(r => r.Id)
                .FirstOrDefaultAsync();
            var users = await _context.Users
                .Where(u => _context.UserRoles
                    .Any(ur => ur.UserId == u.Id && ur.RoleId == userRoleId))
                .Include(u => u.Location)
                .Include(u => u.HomeTown)
                .ToListAsync();

            return users;
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

        public async Task UnLockAndLockOneAccount(string userId)
        {
            await _context.Users
                .Where(u => u.Id == userId)
                .ExecuteUpdateAsync(setters => setters.SetProperty(u => u.IsLock, u => !u.IsLock));
        }

        public async Task UnLockAndLockManyAccount(List<string> users, string number)
        {
            var userIdSet = new HashSet<string>(users);
            if (number.Equals("1"))
            {
                await _context.Users
                    .Where(u => userIdSet.Contains(u.Id))
                    .ExecuteUpdateAsync(setters => setters.SetProperty(u => u.IsLock, u => true));
            }
            else {
                await _context.Users
                    .Where(u => userIdSet.Contains(u.Id))
                    .ExecuteUpdateAsync(setters => setters.SetProperty(u => u.IsLock, u => false));
            }
        }

        public async Task DeleteUser(string id)
        {
            await _context.Users.Where(u=>u.Id == id).ExecuteDeleteAsync();
        }
        public async Task DeleteAllUser()
        {
            var users = await GetAllRoleUser();
            await _context.Users
                .Where(u => users.Select(user => user.Id).Contains(u.Id))
                .ExecuteDeleteAsync();
        }
        public async Task DeleteManyUser(List<string> listUserId)
        {
            await _context.Users
                .Where(u => listUserId.Contains(u.Id))
                .ExecuteDeleteAsync();
        }
        public async Task AddUser(User user)
        {
            await _context.Users.AddAsync(user);
        }
    }
}
