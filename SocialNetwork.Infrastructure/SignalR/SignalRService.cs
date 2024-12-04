using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Entity;

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

        public async void SendNotificationToSpecificUser(string username, NotificationResponse notification)
        {
            await hubContext.Clients.User(username).SendAsync("NewNotification", notification);
        }
    }
}
