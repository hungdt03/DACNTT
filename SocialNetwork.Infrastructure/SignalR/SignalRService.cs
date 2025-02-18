using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Interfaces.Services.Redis;

namespace SocialNetwork.Infrastructure.SignalR
{
    public class SignalRService : ISignalRService
    {
        private readonly IHubContext<ServerHub> hubContext;
        private readonly IUserStatusService userStatusService;
        private readonly ILogger<SignalRService> logger;    

        public SignalRService(IHubContext<ServerHub> hubContext, IUserStatusService userStatusService, ILogger<SignalRService> logger)
        {
            this.hubContext = hubContext;
            this.userStatusService = userStatusService;
            this.logger = logger;
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

        public async Task JoinGroup(string userId, string groupName)
        {
            var connections = await userStatusService.GetAllConnections(userId);
            connections.ForEach(async connection =>
            {
                logger.LogInformation($"ConnectionID: {connection}");
                await hubContext.Groups.AddToGroupAsync(connection, groupName);
            });
            
        }

        public async Task LeaveGroup(string userId, string groupName)
        {
            var connections = await userStatusService.GetAllConnections(userId);
            connections.ForEach(async connection =>
            {
                logger.LogInformation($"ConnectionID: {connection}");
                await hubContext.Groups.RemoveFromGroupAsync(connection, groupName);
            });
        }

        public async Task SendBlockSignalToSpecificUser(string username, Guid chatRoomId)
        {
            await hubContext.Clients.User(username).SendAsync("FetchBlock", chatRoomId);
        }

        public async Task SendActionGroupToSpecificUser(string username, Guid chatRoomId)
        {
            await hubContext.Clients.User(username).SendAsync("FetchChatRoom", chatRoomId);
        }
    }
}
