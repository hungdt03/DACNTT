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

            await db.SetAddAsync("active_users", userId);
        }

        // Xóa connectionId khỏi user_connections:{userId}
        public async Task RemoveConnectionAsync(string userId, string connectionId)
        {
            var db = _redis.GetDatabase();
            await db.SetRemoveAsync($"user_connections:{userId}", connectionId);

            // Kiểm tra nếu người dùng không còn kết nối nào
            var connectionCount = await db.SetLengthAsync($"user_connections:{userId}");

            // Nếu không còn kết nối nào thì đánh dấu là offline và lưu thời gian hoạt động
            if (connectionCount == 0)
            {
                await SetUserOfflineAsync(userId);
            }
        }

        // Kiểm tra xem người dùng có kết nối hay không
        public async Task<bool> HasConnectionsAsync(string userId)
        {
            var db = _redis.GetDatabase();
            return await db.SetLengthAsync($"user_connections:{userId}") > 0;
        }

        public async Task<bool> IsUserActiveAsync(string userId)
        {
            var db = _redis.GetDatabase();
            return await db.SetContainsAsync("active_users", userId);
        }

        // Thiết lập thời gian hoạt động của người dùng khi họ online
        public async Task SetUserActiveTimeAsync(string userId)
        {
            var db = _redis.GetDatabase();
            var currentTime = DateTimeOffset.UtcNow.ToString("o");
            await db.HashSetAsync($"user_status:{userId}", "last_active_time", currentTime);
        }

        public async Task<string> GetLastActiveTimeAsync(string userId)
        {
            var db = _redis.GetDatabase();
            var lastActiveTime = await db.HashGetAsync($"user_status:{userId}", "last_active_time");

            if (lastActiveTime.HasValue)
            {
                return lastActiveTime.ToString();
            }

            return null;
        }

        public async Task SetUserOfflineAsync(string userId)
        {
            var db = _redis.GetDatabase();
            await db.SetRemoveAsync("active_users", userId);
            await SetUserActiveTimeAsync(userId);
        }

        public async Task<IEnumerable<string>> GetAllActiveUsersAsync()
        {
            var db = _redis.GetDatabase();

            var activeUsers = await db.SetMembersAsync("active_users");

            return activeUsers.Select(user => user.ToString());
        }

        public async Task<List<string>> GetAllConnections(string userId)
        {
            var db = _redis.GetDatabase();
            var connections = await db.SetMembersAsync($"user_connections:{userId}");

            return connections.Select(conn => conn.ToString()).ToList();
        }

    }
}
