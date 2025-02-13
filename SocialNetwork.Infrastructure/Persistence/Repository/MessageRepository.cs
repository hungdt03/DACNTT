
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.MessageInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _context;

        public MessageRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task CreateMessageAsync(Message message)
        {
            await _context.Messages.AddAsync(message);
        }

        public async Task<(List<Message>, int)> GetAllMessagesByChatRoomIdAsync(Guid chatRoomId, int page, int size, DateTimeOffset? lastMessageDate)
        {
            var query = _context.Messages
                .Where(msg => msg.ChatRoomId == chatRoomId && (lastMessageDate == null || lastMessageDate.Value >= msg.DateCreated));

            int totalCount = await query.CountAsync(); 
            var messages = await query
                .OrderByDescending(s => s.DateCreated)
                .ThenByDescending(s => s.SentAt)
                .Skip((page - 1) * size).Take(size)
                .Include(m => m.Medias)
                .Include(m => m.Sender)
                .Include(m => m.Reads)
                .ThenInclude(m => m.User)
                .ToListAsync();
            messages.Reverse();
            return (messages, totalCount);
        }

        public async Task<Message?> GetLastMessageByGroupIdAsync(Guid groupId)
        {
            return await _context.Messages
               .Where(m => m.ChatRoom.Id == groupId)
               .OrderByDescending(m => m.SentAt)
               .FirstOrDefaultAsync();
        }

        public async Task<Message?> GetMessageByIdAsync(Guid messageId)
        {
            return await _context.Messages
                .Include(m => m.ChatRoom)
                .Include(m => m.Medias)
               .Include(m => m.Sender)
               .Include(m => m.Reads)
                    .ThenInclude(m => m.User)
                .SingleOrDefaultAsync(m => m.Id == messageId);
        }
    }
}
