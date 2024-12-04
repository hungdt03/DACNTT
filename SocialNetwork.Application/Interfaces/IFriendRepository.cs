
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IFriendRepository
    {
        Task CreateFriendAsync(Friend friend);
        void DeleteFriend(Friend friend);
        Task<IEnumerable<Friend>> GetAllFriendsAsync();
        Task<Friend?> GetFriendByIdAsync(Guid id);
        Task<Friend?> GetFriendByFirstUserIdAndLastUserId(string fId, string lId);
    }
}
