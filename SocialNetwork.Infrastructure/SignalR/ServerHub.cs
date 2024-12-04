using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Application.Configuration;

namespace SocialNetwork.Infrastructure.SignalR
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ServerHub : Hub
    {
        private readonly ConnectionManager connectionManager;

        public ServerHub(ConnectionManager connectionManager)
        {
            this.connectionManager = connectionManager;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.GetUserId();
            await connectionManager.UserConnected(userId, Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.GetUserId();
            await connectionManager.UserDisconnected(userId, Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
