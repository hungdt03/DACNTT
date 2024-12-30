using SocialNetwork.Application.DTOs;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces.Services
{
    public interface ISignalRService
    {
        Task SendNotificationToSpecificUser(string username, NotificationResponse notification);
        Task SendMessageToSpecificGroup(string groupName, MessageResponse message);
        Task SendReadStatusToSpecificGroup(string groupName, MessageResponse message, string userId);
    }
}
