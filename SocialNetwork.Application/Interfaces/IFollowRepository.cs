using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IFollowRepository
    {
        Task CreateFollowAsync(Follow follow);
        Task<Follow?> GetFollowByFollowerIdAndFolloweeIdAsync(string followerId, string followeeId);
        Task<(IEnumerable<Follow> Follows, int TotalCount)> GetAllFolloweesByUserIdAsync(string userId, int page, int size);
        Task<(IEnumerable<Follow> Follows, int TotalCount)> GetAllFollowersByUserIdAsync(string userId, int page, int size);
        Task<int> CountFollowersByUserIdAsync(string userId);
        Task<int> CountFolloweesByUserIdAsync(string userId);
        void DeleteFollow(Follow follow);
    }
}
