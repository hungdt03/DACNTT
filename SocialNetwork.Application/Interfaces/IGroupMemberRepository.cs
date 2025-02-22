
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IGroupMemberRepository 
    {
        Task CreateGroupMemberAsync(GroupMember groupMember);
        Task<(IEnumerable<GroupMember> Members, int TotalCount)> GetAllNonAdminMembersInGroupAsync(Guid groupId, int page, int size);
        Task<(IEnumerable<GroupMember> Members, int TotalCount)> GetAllMembersInGroupAsync(Guid groupId, int page, int size, string query, string role);
        Task<GroupMember?> GetGroupMemberByIdAsync(Guid groupMemberId);
        Task<GroupMember?> GetGroupMemberByGroupIdAndUserId(Guid groupId, string userId);
        void RemoveGroupMember(GroupMember groupMember);
        Task<int> CountGroupMembersByGroupIdAsync(Guid groupId);
        Task<int> CountAdminsByGroupIdAsync(Guid groupId);
        Task<List<GroupMember>> GetAllAdminAndModeratoInGroupAsync(Guid groupId);
        Task<List<GroupMember>> GetAllMembersInGroupIdAsync(Guid groupId);
    }
}
