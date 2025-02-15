using SocialNetwork.Application.Interfaces.Services.Redis;
using StackExchange.Redis;

namespace SocialNetwork.Infrastructure.Redis
{
    public class UserStatusService : IUserStatusService
    {
        private readonly IConnectionMultiplexer _redis;

        public UserStatusService(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        // Thêm connectionId vào user_connections:{userId}
        public async Task AddConnectionAsync(string userId, string connectionId)
        {
            var db = _redis.GetDatabase();
            await db.SetAddAsync($"user_connections:{userId}", connectionId);
        }

        // Xóa connectionId khỏi user_connections:{userId}
        public async Task RemoveConnectionAsync(string userId, string connectionId)
        {
            var db = _redis.GetDatabase();
            await db.SetRemoveAsync($"user_connections:{userId}", connectionId);

        }

        // Kiểm tra xem người dùng có kết nối hay không
        public async Task<bool> HasConnectionsAsync(string userId)
        {
            var db = _redis.GetDatabase();
            return await db.SetLengthAsync($"user_connections:{userId}") > 0;
        }

        
        public async Task<List<string>> GetAllConnections(string userId)
        {
            var db = _redis.GetDatabase();
            var connections = await db.SetMembersAsync($"user_connections:{userId}");

            return connections.Select(conn => conn.ToString()).ToList();
        }

        public async Task ClearAllConnectionsAsync()
        {
            var db = _redis.GetDatabase();
            var server = _redis.GetServer(_redis.GetEndPoints().First());

            // Lấy tất cả key có prefix "user_connections:"
            foreach (var key in server.Keys(pattern: "user_connections:*"))
            {
                await db.KeyDeleteAsync(key);
            }
        }
    }
}
