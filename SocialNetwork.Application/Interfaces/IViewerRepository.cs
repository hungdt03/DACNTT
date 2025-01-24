using SocialNetwork.Domain.Entity.StoryInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IViewerRepository
    {
        Task CreateViewerAsync(Viewer viewer);
        void DeleteViewer(Viewer viewer);
        Task<IEnumerable<Viewer>> GetAllViewerAsync();
        Task<Viewer?> GetViewerByIdAsync(Guid viewerId);
        Task<bool> IsViewerExisted(string userId, Guid storyId);
        Task<IEnumerable<Viewer>> GetAllViewerByStoryIdAsync(Guid storyId);
        Task<bool> IsAnViewersByStoryIdAndUserIdAsync(Guid storyId, string userId);
        Task<bool> IsAnViewersByStoryId(Guid storyId);
        void RemoveRange(IEnumerable<Viewer> viewers);
    }
}
