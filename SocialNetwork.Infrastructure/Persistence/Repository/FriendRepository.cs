
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class FriendRepository : IFriendRepository
    {
        private readonly AppDbContext _context;

        public FriendRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateFriendAsync(Friend friend)
        {
            await _context.Friends.AddAsync(friend);
        }

        public void DeleteFriend(Friend friend)
        {
            _context.Friends.Remove(friend);
        }

      
        public Task<IEnumerable<Friend>> GetAllFriendsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Friend?> GetFriendByFirstUserIdAndLastUserId(string fId, string lId)
        {
            return await _context.Friends
                .SingleOrDefaultAsync(x => (x.FirstUserId == fId && x.LastUserId == lId) || (x.LastUserId == fId && x.FirstUserId == lId));
        }

        public async Task<Friend?> GetFriendByIdAsync(Guid id)
        {
            return await _context.Friends
                .SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}
