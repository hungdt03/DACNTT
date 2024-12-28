

using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IStoryRepository
    {
        Task CreateStoryAsync(Story story);
        Task<ICollection<Story>> GetAllStoriesAsync();

    }
}
