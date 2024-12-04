using SocialNetwork.Application.DTOs;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces.Services
{
    public interface ISignalRService
    {
        void SendNotificationToSpecificUser(string username, NotificationResponse notification);
    }
}
