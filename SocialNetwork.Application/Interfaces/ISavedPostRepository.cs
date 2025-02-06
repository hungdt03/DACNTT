
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface ISavedPostRepository
    {
        Task CreateNewSavedPostAsync(SavedPost savedPost);
        Task<List<SavedPost>> GetAllSavedPostsByUserIdAsync(string userId);
        Task<SavedPost?> GetSavedPostById(Guid id);
        Task<SavedPost?> GetSavedPostByPostIdAndUserId(Guid postId, string userId);
        void RemoveSavedPost(SavedPost savedPost);
    }
}
