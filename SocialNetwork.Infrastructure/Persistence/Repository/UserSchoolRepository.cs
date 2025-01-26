
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.UserInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class UserSchoolRepository : IUserSchoolRepository
    {
        private readonly AppDbContext _context;

        public UserSchoolRepository(AppDbContext context)
        {
            this._context = context;
        }

        public async Task CreateUserSchoolAsync(UserSchool userSchool)
        {
            await _context.UserSchools.AddAsync(userSchool);
        }

        public void DeleteUserSchool(UserSchool userSchool)
        {
            _context.UserSchools.Remove(userSchool);
        }

        public async Task<List<UserSchool>> GetAllUserSchoolsAsync(string userId)
        {
            return await _context.UserSchools
                .Where(u => u.UserId == userId)
                .Include(s => s.Major)
                .Include(s => s.School)
                .ToListAsync();
        }

        public async Task<UserSchool?> GetUserSchoolsByIdAsync(Guid userSchoolId)
        {
            return await _context.UserSchools.SingleOrDefaultAsync(s => s.Id == userSchoolId);
        }
    }
}
