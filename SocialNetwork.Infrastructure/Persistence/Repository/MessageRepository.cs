
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
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

        public async Task<List<Message>> GetAllMessagesByChatRoomIdAsync(Guid chatRoomId)
        {
            var messages = await _context.Messages
               .Include(m => m.Medias)
               .Include(m => m.Sender)
               .Include(m => m.Reads)
                    .ThenInclude(m => m.User)
               .Where(m => m.ChatRoomId == chatRoomId)
               .ToListAsync();

            return messages;
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
