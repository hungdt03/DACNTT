

using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.ChatRoomInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class ChatRoomMemberRepository : IChatRoomMemberRepository
    {
        private readonly AppDbContext _context;

        public ChatRoomMemberRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CountLeaderByChatRoomId(Guid chatRoomId)
        {
            return await _context.ChatRoomMembers
                .Where(c => c.ChatRoomId == chatRoomId).CountAsync();
        }

        public async Task CreateChatRoomMember(ChatRoomMember chatRoomMember)
        {
            await _context.ChatRoomMembers.AddAsync(chatRoomMember);
        }

        public void DeleteMember(ChatRoomMember chatRoomMember)
        {
            _context.ChatRoomMembers.Remove(chatRoomMember);
        }

        public async Task<List<ChatRoomMember>> GetAllMembersByChatRoomIdAsync(Guid chatRoomId)
        {
            return await _context
                .ChatRoomMembers
                 .Include(c => c.User)
                .Where(c => c.ChatRoomId == chatRoomId).ToListAsync();
        }

        public async Task<ChatRoomMember?> GetChatRoomMemberById(Guid memberId)
        {
            return await _context
                .ChatRoomMembers
                .Include(c => c.User)
                .Include(c => c.ChatRoom)
                .SingleOrDefaultAsync(c => c.Id == memberId);
        }

        public async Task<ChatRoomMember?> GetChatRoomMemberByRoomIdAndUserId(Guid chatRoomId, string userId)
        {
            return await _context.ChatRoomMembers
                .SingleOrDefaultAsync(s => s.UserId == userId && s.ChatRoomId == chatRoomId);
        }
    }
}
