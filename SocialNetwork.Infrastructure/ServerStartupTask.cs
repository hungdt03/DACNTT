using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Infrastructure.DBContext;


namespace SocialNetwork.Infrastructure
{
    public class ServerStartupTask : IHostedService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<ServerStartupTask> _logger;

        public ServerStartupTask(IServiceScopeFactory serviceScopeFactory, ILogger<ServerStartupTask> logger)
        {
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var userStatusService = scope.ServiceProvider.GetRequiredService<IUserStatusService>();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            _logger.LogInformation("====================STARTING RESET STATUS OF USER===================");
            await dbContext.Database.ExecuteSqlRawAsync("UPDATE AspNetUsers SET IsOnline = 0");
            _logger.LogInformation("====================FINISHING RESET STATUS OF USER===================");

            _logger.LogInformation("====================STARTING CLEAR ALL CONNECTIONS===================");
            // Xóa tất cả connections trong Redis
            await userStatusService.ClearAllConnectionsAsync();
            _logger.LogInformation("====================FINISHING CLEAR ALL CONNECTIONS===================");
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
