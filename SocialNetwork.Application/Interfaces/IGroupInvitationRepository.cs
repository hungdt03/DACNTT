

using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IGroupInvitationRepository
    {
        Task CreateNewGroupInvitationAsync(GroupInvitation groupInvitation);
        Task<List<GroupInvitation>> GetAllInvitationsByGroupIdAsync(Guid groupId);
        Task<(List<GroupInvitation> GroupInvitations, int TotalCount)> GetAllPendingInvitationsByGroupIdAsync(Guid groupId, int page, int size);
        Task<(List<GroupInvitation> GroupInvitations, int TotalCount)> GetAllPendingInvitationsByInviteeIdAsync(string userId, int page, int size);
        void RemoveGroupInvitation(GroupInvitation groupInvitation);
        Task<GroupInvitation?> GetGroupInvitationByIdAsync(Guid id);
        Task<GroupInvitation?> GetGroupInvitationByInviteeIdAndGroupIdAsync(string inviteeId, Guid groupId);
        Task<GroupInvitation?> GetGroupInvitationByInviterIdAndInviteeIdAndGroupIdAsync(string inviterId, string inviteeId, Guid groupId);
    }
}
