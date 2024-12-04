
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class FriendRequestRepository : IFriendRequestRepository
    {
        private readonly AppDbContext _context;

        public FriendRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateFriendRequestAsync(FriendRequest request)
        {
            await _context.FriendRequests.AddAsync(request);
        }

        public void DeleteFriendRequest(FriendRequest request)
        {
            _context.FriendRequests.Remove(request);
        }

        public async Task<FriendRequest?> GetFriendRequestByIdAsync(Guid id)
        {
            return await _context.FriendRequests
                .Include(fr => fr.Sender)
                .Include(fr => fr.Receiver)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<FriendRequest?> GetFriendRequestBySenderIdAndReceiverIdAsync(string senderId, string receiverId)
        {
            return await _context.FriendRequests
                .Include(f => f.Sender)
                .Include(f => f.Receiver)
                .SingleOrDefaultAsync(s => 
                (s.SenderId == senderId && s.ReceiverId == receiverId)
                || (s.SenderId == receiverId && s.ReceiverId == senderId)
            );
        }
    }
}
