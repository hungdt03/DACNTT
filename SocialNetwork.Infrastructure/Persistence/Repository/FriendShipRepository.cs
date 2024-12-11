﻿
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
    }
}
