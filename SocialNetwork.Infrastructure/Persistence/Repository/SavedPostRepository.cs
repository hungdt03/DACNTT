
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.UserInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class SavedPostRepository : ISavedPostRepository
    {
        private readonly AppDbContext _context;

        public SavedPostRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNewSavedPostAsync(SavedPost savedPost)
        {
            await _context.SavedPosts.AddAsync(savedPost);
        }

        public async Task<List<SavedPost>> GetAllSavedPostsByUserIdAsync(string userId)
        {
            return await _context.SavedPosts
                .Where(s => s.UserId == userId)
                .ToListAsync();
        }

        public async Task<SavedPost?> GetSavedPostById(Guid id)
        {
            return await _context
                .SavedPosts.SingleOrDefaultAsync(s => s.Id == id);
        }

        public async Task<SavedPost?> GetSavedPostByPostId(Guid postId)
        {
            return await _context
                .SavedPosts.SingleOrDefaultAsync(s => s.PostId == postId);
        }

        public async Task<SavedPost?> GetSavedPostByPostIdAndUserId(Guid postId, string userId)
        {
            return await _context
                .SavedPosts.SingleOrDefaultAsync(s => s.PostId == postId && s.UserId == userId);
        }

        public void RemoveSavedPost(SavedPost savedPost)
        {
            _context.SavedPosts.Remove(savedPost);
        }
    }
}
