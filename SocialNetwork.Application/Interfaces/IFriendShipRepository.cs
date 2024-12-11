
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IFriendShipRepository
    {
        Task CreateFriendShipAsync(FriendShip request);
        void DeleteFriendShip(FriendShip request);
        Task<FriendShip?> GetFriendShipByIdAsync(Guid id);
        Task<FriendShip?> GetFriendShipByUserIdAndFriendIdAsync(string userId, string friendId);
        Task<IEnumerable<FriendShip>> GetAllFriendShipsAsyncByUserId(string userId);
     
    }
}
