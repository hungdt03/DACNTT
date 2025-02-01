using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IJoinGroupRequestRepository
    {
        Task CreateJoinGroupRequestAsync(JoinGroupRequest request);
        Task<int> CountPendingJoinGroupRequestedAsync(Guid groupId);
        Task<JoinGroupRequest?> GetJoinGroupRequestByIdAsync(Guid requestId);
    }
}
