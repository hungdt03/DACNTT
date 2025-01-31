

using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IGroupInvitationRepository
    {
        Task CreateNewGroupInvitationAsync(GroupInvitation groupInvitation);
        Task<List<GroupInvitation>> GetAllInvitationsByGroupIdAsync(Guid groupId);
        void RemoveGroupInvitation(GroupInvitation groupInvitation);
        Task<GroupInvitation?> GetGroupInvitationByIdAsync(Guid id);
        Task<GroupInvitation?> GetGroupInvitationByInviteeIdAndGroupIdAsync(string inviteeId, Guid groupId);
        Task<GroupInvitation?> GetGroupInvitationByInviterIdAndInviteeIdAndGroupIdAsync(string inviterId, string inviteeId, Guid groupId);
    }
}
