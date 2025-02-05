
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IGroupRoleInvitationRepository
    { 
        Task CreateNewInvitationAsync(GroupRoleInvitation groupRoleInvitation);
        void RemoveRoleInvitation(GroupRoleInvitation groupRoleInvitation);
        Task<List<GroupRoleInvitation>> GetAllByGroupIdAsync(Guid groupId);
        Task<GroupRoleInvitation?> GetByIdAsync(Guid id);
        Task<bool> AnyRoleInvitaionAsync(string inviteeId, Guid groupId);
        Task<GroupRoleInvitation?> GetInvitationByInviteeAndGroupIdAsync(string userId, Guid groupId);
        Task<GroupRoleInvitation?> GetAdminInvitationByInviteeAndGroupIdAsync(string userId, Guid groupId);
        Task<GroupRoleInvitation?> GetModeratorInvitationByInviteeAndGroupIdAsync(string userId, Guid groupId);
    }
}
