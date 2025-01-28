
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IGroupMemberRepository 
    {
        Task CreateGroupMemberAsync(GroupMember groupMember);
        Task<IEnumerable<GroupMember>> GetAllMembersInGroupAsync(Guid groupId);
        Task<GroupMember?> GetGroupMemberByIdAsync(Guid groupMemberId);
    }
}
