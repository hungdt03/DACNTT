

using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.MessageInfo;
using SocialNetwork.Infrastructure.DBContext;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class MessageMediaRepository : IMessageMediaRepository
    {
        private readonly AppDbContext _context;

        public MessageMediaRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(IEnumerable<MessageMedia> medias, int TotalCount)> GetAllMessageMediasByChatRoomIdAsync(Guid chatRoomId, int page, int size)
        {
            var query = _context.MessageMedias
                .Include(m => m.Message);

            var totalCount = await query.CountAsync();

             var medias = await query
                .Where(m => m.Message.ChatRoomId == chatRoomId)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync(); 

            return (medias, totalCount);
        }
    }
}
