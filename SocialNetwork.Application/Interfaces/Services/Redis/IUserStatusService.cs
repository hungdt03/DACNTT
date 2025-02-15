

namespace SocialNetwork.Application.Interfaces.Services.Redis
{
    public interface IUserStatusService
    {
        // Thêm connectionId vào user_connections:{userId}
        public Task AddConnectionAsync(string userId, string connectionId);

        // Xóa connectionId khỏi user_connections:{userId}
        public Task RemoveConnectionAsync(string userId, string connectionId);
        public Task<List<string>> GetAllConnections(string userId);

        // Kiểm tra xem người dùng có kết nối hay không
        public Task<bool> HasConnectionsAsync(string userId);
        public Task ClearAllConnectionsAsync();

    }
}
