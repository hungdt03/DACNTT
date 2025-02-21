using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Contracts.Requests;
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
                .Include(u=>u.Followers)
                .Include(u => u.Followings)
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
            await _context.Users
                .Where(u => u.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(u => u.IsDeleted, true)
                    .SetProperty(u => u.DeletedAt, DateTime.UtcNow)
                );
        }

        public async Task DeleteAllUser()
        {
            var users = await GetAllRoleUser();
            var userIds = users.Select(user => user.Id).ToList();

            await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(u => u.IsDeleted, true)
                    .SetProperty(u => u.DeletedAt, DateTime.UtcNow)
                );
        }

        public async Task DeleteManyUser(List<string> listUserId)
        {
            await _context.Users
                .Where(u => listUserId.Contains(u.Id))
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(u => u.IsDeleted, true)
                    .SetProperty(u => u.DeletedAt, DateTime.UtcNow)
                );
        }
        public async Task<int> CountAllUser()
        {
            return await _context.Users.CountAsync();
        }
        public async Task<int> CountAllUserIsLock()
        {
            return await _context.Users.Where(u => u.IsLock == true).CountAsync();
        }
        public async Task<List<int>> GetRegistrationYears()
        {
            var years = await _context.Users
                .Select(user => user.DateJoined.Year)
                .Distinct()
                .OrderBy(year => year)
                .ToListAsync();

            return years;
        }
        public async Task<List<MonthlyRegistrationStatsResponse>> GetRegistrationStatsByYear(int year)
        {
            var monthlyStats = await _context.Users
                .Where(user => user.DateJoined.Year == year)
                .GroupBy(user => user.DateJoined.Month)
                .Select(group => new MonthlyRegistrationStatsResponse
                {
                    Month = group.Key,
                    Year = year,
                    Count = group.Count()
                })
                .ToListAsync();
            for (int month = 1; month <= 12; month++)
            {
                if (!monthlyStats.Any(stat => stat.Month == month))
                {
                    monthlyStats.Add(new MonthlyRegistrationStatsResponse
                    {
                        Month = month,
                        Year = year,
                        Count = 0
                    });
                }
            }

            monthlyStats = monthlyStats.OrderBy(stat => stat.Month).ToList();
            return monthlyStats;
        }
        public async Task<User> GetTop1UserFollowers()
        {
            return await _context.Users
                .OrderByDescending(u => _context.Follows.Count(f => f.FolloweeId == u.Id))
                .FirstOrDefaultAsync();
        }

    }
}
