
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IGroupRepository
    {
        Task CreateGroupAsync(Group group);
        Task<IEnumerable<Group>> GetAllGroupsAsync();
        Task<Group?> GetGroupByIdAsync(Guid groupId); 
        Task<IEnumerable<Group>> GetAllGroupsManageByUserId(string userId);
        Task<IEnumerable<Group>> GetAllGroupsJoinByUserId(string userId);
    }
}
