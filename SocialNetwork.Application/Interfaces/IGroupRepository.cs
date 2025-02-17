
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
        Task<(IEnumerable<Group> Groups, int TotalCount)> GetAllGroupsContainsKey(string key, int page, int size);
        void RemoveGroup(Group group);
        Task DeleteOneGroup(Guid id);
        Task DeletManyGroup(List<string> listGroupId);
        Task DeleteAllGroup();
        Task<int> CountAllGroup();
    }
}
