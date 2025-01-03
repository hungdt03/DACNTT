

namespace SocialNetwork.Application.Interfaces.Services.Redis
{
    public interface IUserStatusService
    {
        // Thêm connectionId vào user_connections:{userId}
        public Task AddConnectionAsync(string userId, string connectionId);

        // Xóa connectionId khỏi user_connections:{userId}
        public Task RemoveConnectionAsync(string userId, string connectionId);

        // Kiểm tra xem người dùng có kết nối hay không
        public Task<bool> HasConnectionsAsync(string userId);

        // Thiết lập thời gian hoạt động của người dùng khi họ online
        public Task SetUserActiveTimeAsync(string userId);

        // Lấy thời gian hoạt động gần nhất của người dùng
        public Task<string> GetLastActiveTimeAsync(string userId);

        public Task<IEnumerable<string>> GetAllActiveUsersAsync();
    }
}
