
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Domain.Entity.UserInfo;
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

        public async Task<int> CountFriendsByUserIdAsync(string userId)
        {
            return await _context.FriendShips
                .Where(f => f.UserId == userId || f.FriendId == userId && f.Status.Equals(FriendShipStatus.ACCEPTED))
                .CountAsync();
        }

        public async Task CreateFriendShipAsync(FriendShip request)
        {
            await _context.FriendShips.AddAsync(request);
        }

        public void DeleteFriendShip(FriendShip request)
        {
            _context.FriendShips.Remove(request);
        }

        public async Task<IEnumerable<FriendShip?>> GetAllFriendRequestByUserId(string userId, string status = "PENDING")
        {
            return await _context.FriendShips
                .Include(fr => fr.User)
                .Include(fr => fr.Friend)
                .Where(x => x.FriendId == userId && (string.IsNullOrEmpty(status) || x.Status.Equals(status))).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetAllFriendsByName(string userId, string fullName)
        {
            var lowerKey = fullName.ToLower();
            return await _context.FriendShips
                .Include(s => s.Friend)
                .Include(s => s.User)
                .Where(s => 
                    s.Status.Equals(FriendShipStatus.ACCEPTED) 
                    && (s.FriendId == userId || s.UserId == userId)
                    && (s.FriendId == userId ? s.User.FullName.ToLower().Contains(lowerKey) : s.Friend.FullName.ToLower().Contains(lowerKey))
                )
                .Select(s => s.FriendId == userId ? s.User : s.Friend)
                .ToListAsync();
        }

        public async Task<IEnumerable<FriendShip>> GetAllFriendShipsAsyncByUserId(string userId, string status = "PENDING")
        {
            return await _context.FriendShips
                 .Include(f => f.User)
                    .Include(f => f.Friend)
                    .Where(s => (s.UserId == userId || s.FriendId == userId) && (string.IsNullOrEmpty(status) || s.Status.Equals(status))).ToListAsync();
        }

        public async Task<FriendShip?> GetFriendShipByIdAsync(Guid id, string status = "PENDING")
        {
            return await _context.FriendShips
                .Include(fr => fr.User)
                .Include(fr => fr.Friend)
                .SingleOrDefaultAsync(x => x.Id == id && (string.IsNullOrEmpty(status) || x.Status.Equals(status)));
        }

        public async Task<FriendShip?> GetFriendShipByUserIdAndFriendIdAsync(string userId, string friendId, string status = "PENDING")
        {
            return await _context.FriendShips
               .Include(f => f.User)
               .Include(f => f.Friend)
               .SingleOrDefaultAsync(s =>
                    ((s.UserId == userId && s.FriendId == friendId)
                    || (s.UserId == friendId && s.FriendId == userId))
                    && (string.IsNullOrEmpty(status) || s.Status.Equals(status))
           );
        }


        public async Task<FriendShip?> GetFriendShipByUserIdAndFriendIdAsync(string userId, string friendId)
        {
            return await _context.FriendShips
               .Include(f => f.User)
               .Include(f => f.Friend)
               .SingleOrDefaultAsync(s =>
                    ((s.UserId == userId && s.FriendId == friendId)
                    || (s.UserId == friendId && s.FriendId == userId))
           );
        }
    }
}
