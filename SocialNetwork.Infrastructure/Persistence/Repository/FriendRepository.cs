
//using Microsoft.EntityFrameworkCore;
//using SocialNetwork.Application.Interfaces;
//using SocialNetwork.Domain.Entity;
//using SocialNetwork.Infrastructure.DBContext;

//namespace SocialNetwork.Infrastructure.Persistence.Repository
//{
//    public class FriendRepository : IFriendRepository
//    {
//        private readonly AppDbContext _context;

//        public FriendRepository(AppDbContext context)
//        {
//            _context = context;
//        }

//        public async Task CreateFriendAsync(Friend friend)
//        {
//            await _context.Friends.AddAsync(friend);
//        }

//        public void DeleteFriend(Friend friend)
//        {
//            _context.Friends.Remove(friend);
//        }
      
//        public async Task<IEnumerable<Friend>> GetAllFriendsAsyncByUserId(string userId)
//        {
//            return await _context.Friends
//                .Include(s => s.FriendUser)
//                .Where(s => s.UserId == userId).ToListAsync();
//        }

//        public async Task<Friend?> GetFriendByFriendIdAndUserId(string fId, string uId)
//        {
//            return await _context.Friends
//                .SingleOrDefaultAsync(x => x.FriendId == fId && x.UserId == uId);
//        }

//        public async Task<Friend?> GetFriendByIdAsync(Guid id)
//        {
//            return await _context.Friends
//                .SingleOrDefaultAsync(x => x.Id == id);
//        }
//    }
//}
