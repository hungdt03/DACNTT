
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class ChatRoomRepository : IChatRoomRepository
    {
        private readonly AppDbContext _context;

        public ChatRoomRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateChatRoom(ChatRoom chatRoom)
        {
            await _context.ChatRooms.AddAsync(chatRoom);
        }

        public async Task<List<ChatRoom>> GetAllChatRoomsByUserIdAsync(string userId)
        {
            var chatRooms = await _context.ChatRooms
                .Include(c => c.Members)
                    .ThenInclude(c => c.User)
                .Where(c => c.Members.Any(s => s.UserId.Equals(userId)))
                .OrderByDescending(c => c.LastMessageDate)
                .ToListAsync();

            return chatRooms;
        }

        public async Task<ChatRoom?> GetChatRoomByIdAsync(Guid id)
        {
            return await _context.ChatRooms
                .Include(c => c.Members)
                    .ThenInclude(c => c.User)
                .SingleOrDefaultAsync(c => c.Id == id);
        }

        public async Task<ChatRoom?> GetChatRoomByUniqueNameAsync(string uniqueName)
        {
            return await _context.ChatRooms
                .Include(c => c.Members)
                    .ThenInclude(c => c.User)
                .SingleOrDefaultAsync(c => c.UniqueName == uniqueName);
        }
    }
}
