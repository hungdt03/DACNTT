using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface ITagRepository
    {
        Task<Tag?> GetTagByIdAsync(Guid id);
        Task<Tag?> GetTagByPostIdAndUserIdAsync(Guid postId, string userId);
        void DeleteTag(Tag tag);
        void RemoveRange(List<Tag> tags);
        Task<List<Tag>> GetAllTagsByPostIdAsync(Guid postId);
    }
}
