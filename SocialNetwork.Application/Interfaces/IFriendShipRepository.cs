
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IFriendShipRepository
    {
        Task CreateFriendShipAsync(FriendShip request);
        void DeleteFriendShip(FriendShip request);
        Task<FriendShip?> GetFriendShipByIdAsync(Guid id, string status = FriendShipStatus.PENDING);
        Task<IEnumerable<User>> GetAllFriendsByName(string userId, string fullName);
        Task<FriendShip?> GetFriendShipByUserIdAndFriendIdAsync(string userId, string friendId, string status = "");
        Task<IEnumerable<FriendShip>> GetAllFriendShipsAsyncByUserId(string userId, string status = "");
        Task<int> CountFriendsByUserIdAsync(string userId);
    }
}
