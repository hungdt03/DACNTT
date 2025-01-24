using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IFollowRepository
    {
        Task CreateFollowAsync(Follow follow);
        Task<Follow?> GetFollowByFollowerIdAndFolloweeIdAsync(string followerId, string followeeId);
        Task<IEnumerable<Follow>> GetAllFolloweesByUserIdAsync(string userId);
        Task<IEnumerable<Follow>> GetAllFollowersByUserIdAsync(string userId);
        Task<int> CountFollowersByUserIdAsync(string userId);
        Task<int> CountFolloweesByUserIdAsync(string userId);
        void DeleteFollow(Follow follow);
    }
}
