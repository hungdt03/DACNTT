
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class ReactionRepository : IReactionRepository
    {
        private readonly AppDbContext appDbContext;

        public ReactionRepository(AppDbContext appDbContext)
        {
            this.appDbContext = appDbContext;
        }

        public async Task CreateReactionAsync(Reaction reaction)
        {
            await appDbContext.Reactions.AddAsync(reaction);
        }

        public async Task<List<Reaction>> GetAllReactionsByPostIdAsync(Guid postId)
        {
            return await appDbContext.Reactions
                .Include(r => r.User)
                .Where(r => r.PostId == postId)
                .ToListAsync();
        }

        public async Task<Reaction?> GetReactionByPostIdAndUserIdAsync(Guid postId, string userId)
        {
            return await appDbContext.Reactions
                .SingleOrDefaultAsync(s => s.UserId == userId && s.PostId == postId);
        }

        public void RemoveReaction(Reaction reaction)
        {
            appDbContext.Reactions.Remove(reaction);
        }
    }
}
