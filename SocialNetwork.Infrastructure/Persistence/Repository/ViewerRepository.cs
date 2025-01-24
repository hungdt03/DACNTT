

using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class ViewerRepository : IViewerRepository
    {
        private readonly AppDbContext _context;

        public ViewerRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task CreateViewerAsync(Viewer viewer)
        {
            await _context.Viewers.AddAsync(viewer);
        }

        public void DeleteViewer(Viewer viewer)
        {
            _context.Viewers.Remove(viewer);
        }

        public async Task<IEnumerable<Viewer>> GetAllViewerAsync()
        {
            return await _context.Viewers.ToListAsync();
        }

        public async Task<IEnumerable<Viewer>> GetAllViewerByStoryIdAsync(Guid storyId)
        {
            return await _context.Viewers
                .Include(v => v.User)
                .Where(v => v.StoryId == storyId)
                .ToListAsync();
        }

        public async Task<Viewer?> GetViewerByIdAsync(Guid viewerId)
        {
            return await _context.Viewers.SingleOrDefaultAsync(viewer => viewer.Id == viewerId);
        }

        public async Task<bool> IsAnViewersByStoryId(Guid storyId)
        {
            return await _context.Viewers.AnyAsync(v => v.StoryId == storyId);
        }

        public async Task<bool> IsAnViewersByStoryIdAndUserIdAsync(Guid storyId, string userId)
        {
            return await _context.Viewers.AnyAsync(v => v.StoryId == storyId && v.UserId == userId);
        }

        public async Task<bool> IsViewerExisted(string userId, Guid storyId)
        {
            return await _context.Viewers.AnyAsync(v => v.UserId == userId && v.StoryId == storyId);
        }

        public void RemoveRange(IEnumerable<Viewer> viewers)
        {
            _context.Viewers.RemoveRange(viewers);
        }
    }
}
