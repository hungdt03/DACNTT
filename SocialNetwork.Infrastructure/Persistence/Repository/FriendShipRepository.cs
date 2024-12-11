
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class FriendShipRepository : IFriendShipRepository
    {
        private readonly AppDbContext _context;

        public FriendShipRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateFriendShipAsync(FriendShip request)
        {
            await _context.FriendShips.AddAsync(request);
        }

        public void DeleteFriendShip(FriendShip request)
        {
            _context.FriendShips.Remove(request);
        }

        public async Task<IEnumerable<FriendShip>> GetAllFriendShipsAsyncByUserId(string userId)
        {
            return await _context.FriendShips
                .Where(s => s.UserId == userId).ToListAsync();
        }

        public async Task<FriendShip?> GetFriendShipByIdAsync(Guid id)
        {
            return await _context.FriendShips
                .Include(fr => fr.User)
                .Include(fr => fr.Friend)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<FriendShip?> GetFriendShipByUserIdAndFriendIdAsync(string userId, string friendId)
        {
            return await _context.FriendShips
                .Include(f => f.User)
                .Include(f => f.Friend)
                .SingleOrDefaultAsync(s =>
                (s.UserId == userId && s.FriendId == friendId)
                || (s.UserId == friendId && s.FriendId == userId)
            );
        }
    }
}
