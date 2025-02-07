using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface INotificationRepository
    {
        Task CreateNotificationAsync(Notification notification);
        Task<(List<Notification> notifications, int totalCount)> GetAllNotificationsAsync(string userId, int page, int size);
        Task<Notification?> GetNotificationByIdAsync(Guid id);
        void DeleteNotification(Notification notification);
        Task<List<Notification>> GetAllNotificationsByPostIdAsync(Guid postId);
        Task<List<Notification>> GetAllNotificationsByFriendShipId(Guid friendShipId);
        void RemoveRange(IEnumerable<Notification> notifications);
    }
}
