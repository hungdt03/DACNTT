
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IFriendRequestRepository
    {
        Task CreateFriendRequestAsync(FriendRequest request);
        void DeleteFriendRequest(FriendRequest request);
        Task<FriendRequest?> GetFriendRequestByIdAsync(Guid id);
        Task<FriendRequest?> GetFriendRequestBySenderIdAndReceiverIdAsync(string senderId, string receiverId);
    }
}
