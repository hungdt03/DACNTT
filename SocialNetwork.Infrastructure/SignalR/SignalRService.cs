using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Interfaces.Services;

namespace SocialNetwork.Infrastructure.SignalR
{
    public class SignalRService : ISignalRService
    {
        private readonly IHubContext<ServerHub> hubContext;
        private readonly ConnectionManager connectionManager;

        public SignalRService(IHubContext<ServerHub> hubContext, ConnectionManager connectionManager)
        {
            this.hubContext = hubContext;
            this.connectionManager = connectionManager;
        }

        public async Task SendMessageToSpecificGroup(string groupName, MessageResponse message)
        {
            await hubContext.Clients.Group(groupName).SendAsync("NewMessage", message);
        }

        public async Task SendReadStatusToSpecificGroup(string groupName, MessageResponse message, string userId)
        {
            await hubContext.Clients.Group(groupName).SendAsync("NewRead", message, userId);
        }

        public async Task SendNotificationToSpecificUser(string username, NotificationResponse notification)
        {
            await hubContext.Clients.User(username).SendAsync("NewNotification", notification);
        }
    }
}
