

using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IStoryRepository
    {
        Task CreateStoryAsync(Story story);
        Task<ICollection<Story>> GetAllStoriesAsync();
        Task<Story?> GetStoryByIdAsync(Guid id);
        Task<ICollection<Story>> GetAllStoriesByUserIdAsync(string userId);
        void DeleteStory(Story story);
    }
}
