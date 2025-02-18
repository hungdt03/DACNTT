using SocialNetwork.Application.DTOs;

namespace SocialNetwork.Application.Interfaces.Services
{
    public interface ISignalRService
    {
        Task SendNotificationToSpecificUser(string username, NotificationResponse notification);
        Task SendMessageToSpecificGroup(string groupName, MessageResponse message);
        Task SendBlockSignalToSpecificUser(string username, Guid chatRoomId);
        Task SendActionGroupToSpecificUser(string username, Guid chatRoomId);
        Task SendReadStatusToSpecificGroup(string groupName, MessageResponse message, string userId);
        Task JoinGroup(string userId, string groupName);
        Task LeaveGroup(string userId, string groupName);
    }
}
