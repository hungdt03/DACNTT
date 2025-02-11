using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IReactionRepository
    {
        Task<List<Reaction>> GetAllReactionsByPostIdAsync(Guid postId);
        Task<Reaction?> GetReactionByPostIdAndUserIdAsync(Guid postId, string userId);
        Task CreateReactionAsync(Reaction reaction);
        Task<int> CountReactionsByUserIdAsync(string userId);
        Task<int> CountReactionsByPostId(Guid postId);
        void RemoveReaction(Reaction reaction);
        void RemoveRange(IEnumerable<Reaction> reactions);
    }
}
