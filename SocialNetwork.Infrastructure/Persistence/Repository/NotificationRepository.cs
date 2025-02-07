

using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNotificationAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }


        public async Task<Notification?> GetNotificationByIdAsync(Guid id)
        {
            return await _context.Notifications.SingleOrDefaultAsync(x => x.Id == id);
        }

        public void DeleteNotification(Notification notification)
        {
            _context.Notifications.Remove(notification);
        }

        public async Task<(List<Notification> notifications, int totalCount)> GetAllNotificationsAsync(string userId, int page, int size)
        {
            var query = _context.Notifications.Where(c => c.RecipientId == userId);

            var totalCount = await query.CountAsync();

            var notifications = await query
                .Include(n => n.Recipient)
                .OrderByDescending(c => c.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (notifications, totalCount);
        }

        public async Task<List<Notification>> GetAllNotificationsByPostIdAsync(Guid postId)
        {
            return await _context.Notifications.Where(n => n.PostId == postId).ToListAsync();
        }

        public async Task<List<Notification>> GetAllNotificationsByFriendShipId(Guid friendShipId)
        {
            return await _context.Notifications.Where(n => n.FriendRequestId == friendShipId).ToListAsync();
        }

        public void RemoveRange(IEnumerable<Notification> notifications)
        {
            _context.Notifications.RemoveRange(notifications);
        }
    }
}
