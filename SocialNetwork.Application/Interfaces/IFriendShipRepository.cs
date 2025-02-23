
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IFriendShipRepository
    {
        Task CreateFriendShipAsync(FriendShip request);
        void DeleteFriendShip(FriendShip request);
        Task<FriendShip?> GetFriendShipByIdAsync(Guid id, string status = FriendShipStatus.PENDING);
        Task<IEnumerable<User>> GetAllFriendsByName(string userId, string fullName);
        Task<FriendShip?> GetFriendShipByUserIdAndFriendIdAsync(string userId, string friendId, string status = "");
        Task<FriendShip?> GetFriendShipByUserIdAndFriendIdAsync(string userId, string friendId);
        Task<(IEnumerable<FriendShip> FriendShips, int TotalCount)> GetAllFriendShipsAsyncByUserId(string userId, int page, int size, string status = "");
        Task<IEnumerable<FriendShip>> GetAllFriendShipsAsyncByUserId(string userId, string status = "");
        Task<int> CountFriendsByUserIdAsync(string userId);
        Task<(IEnumerable<FriendShip> FriendRequests, int TotalCount)> GetAllPendingFriendRequestByUserId(string userId, int page, int size);
        Task<IEnumerable<FriendShip>> GetAllConnectedUsers(string userId);
        Task<(IEnumerable<FriendShip> FriendShips, int TotalCount)> GetAllFriendsAsyncByUserId(string userId, int page, int size, string search);
    }
}
