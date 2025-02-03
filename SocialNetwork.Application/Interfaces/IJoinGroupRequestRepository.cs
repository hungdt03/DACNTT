using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IJoinGroupRequestRepository
    {
        Task CreateJoinGroupRequestAsync(JoinGroupRequest request);
        Task<int> CountPendingJoinGroupRequestedAsync(Guid groupId);
        void RemoveJoinGroupRequest(JoinGroupRequest request);
        Task<JoinGroupRequest?> GetJoinGroupRequestByIdAsync(Guid requestId);
        Task<JoinGroupRequest?> GetJoinGroupRequestByUserIdAndGroupIdAsync(string userId, Guid groupId);
        Task<(List<JoinGroupRequest> Requests, int TotalCount)> GetPendingJoinGroupRequestedAsync(Guid groupId, int page, int size);
    }
}
