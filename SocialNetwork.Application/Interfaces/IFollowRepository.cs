using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IFollowRepository
    {
        Task CreateFollowAsync(Follow follow);
        Task<Follow?> GetFollowByFollowerIdAndFolloweeIdAsync(string followerId, string followeeId);
        Task<(IEnumerable<Follow> Follows, int TotalCount)> GetAllFolloweesByUserIdAsync(string userId, int page, int size, string? search = "");
        Task<(IEnumerable<Follow> Follows, int TotalCount)> GetAllFollowersByUserIdAsync(string userId, int page, int size, string? search = "");
        Task<IEnumerable<Follow>> GetAllFollowersByUserIdAsync(string userId);
        Task<int> CountFollowersByUserIdAsync(string userId);
        Task<int> CountFolloweesByUserIdAsync(string userId);
        void DeleteFollow(Follow follow);
        Task<bool> IsFollowUserByFollowerIdAsync(string userId, string followerId);
    }
}
