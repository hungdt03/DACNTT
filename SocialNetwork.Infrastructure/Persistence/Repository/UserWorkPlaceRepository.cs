
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.UserInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class UserWorkPlaceRepository : IUserWorkPlaceRepository
    {
        private readonly AppDbContext _context;

        public UserWorkPlaceRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task CreateUserWorkPlaceAsync(UserWorkPlace userWorkPlace)
        {
            await _context.UserWorkPlaces.AddAsync(userWorkPlace);
        }

        public void DeleteUserWorkPlace(UserWorkPlace userWorkPlace)
        {
            _context.UserWorkPlaces.Remove(userWorkPlace);
        }

        public async Task<List<UserWorkPlace>> GetAllUserWorkPlacesAsync(string userId)
        {
            return await _context.UserWorkPlaces
                .Include(x => x.Company)
                .Include(x => x.Position)
                .Where(u => u.UserId == userId).ToListAsync();
        }

        public async Task<UserWorkPlace?> GetUserWorkPlaceByIdAsync(Guid userWorkPlaceId)
        {
            return await _context.UserWorkPlaces.SingleOrDefaultAsync(u => u.Id == userWorkPlaceId);
        }
    }
}
