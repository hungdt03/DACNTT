
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class MessageReadStatusRepository : IMessageReadStatusRepository
    {
        private readonly AppDbContext _context;

        public MessageReadStatusRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateMessageReadStatusAsync(MessageReadStatus messageReadStatus)
        {
            await _context.MessageReadStatuses.AddAsync(messageReadStatus);
        }

        public async Task<MessageReadStatus?> GetMessageReadStatusByUserAndChatRoomId(string userId, Guid chatRoomId)
        {
            return await _context.MessageReadStatuses
                .Include(x => x.Message)
                .SingleOrDefaultAsync(x => x.Message.ChatRoomId == chatRoomId && x.UserId == userId);
        }

        public async Task<List<MessageReadStatus>> GetMessageReadStatusesByMessageId(Guid messageId)
        {
            var messageReadStatuses = await _context.MessageReadStatuses
                .Where(x => x.MessageId == messageId)
                .ToListAsync();

            return messageReadStatuses;
        }

    }
}
