

using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IReactionRepository
    {
        Task<List<Reaction>> GetAllReactionsByPostIdAsync(Guid postId);
        Task<Reaction?> GetReactionByPostIdAndUserIdAsync(Guid postId, string userId);
        Task CreateReactionAsync(Reaction reaction);
        void RemoveReaction(Reaction reaction);
        void RemoveRange(IEnumerable<Reaction> reactions);
    }
}
