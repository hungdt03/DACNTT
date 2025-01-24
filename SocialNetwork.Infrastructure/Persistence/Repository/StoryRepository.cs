
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class StoryRepository : IStoryRepository
    {
        private readonly AppDbContext _context;

        public StoryRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task CreateStoryAsync(Story story)
        {
            await _context.Stories.AddAsync(story);
        }

        public void DeleteStory(Story story)
        {
            _context.Stories.Remove(story);
        }

        public async Task<ICollection<Story>> GetAllStoriesAsync()
        {
            return await _context.Stories
                .Include(s => s.User)
                .Where(s => s.ExpiresAt > DateTimeOffset.UtcNow && s.Privacy == PrivacyConstant.PUBLIC)
                .OrderByDescending(s => s.DateCreated)
                .ToListAsync();
        }

        public async Task<ICollection<Story>> GetAllStoriesByUserIdAsync(string userId)
        {
            return await _context.Stories
                 .Include(s => s.User)
                 .Where(s => s.ExpiresAt > DateTimeOffset.UtcNow && s.UserId == userId)
                 .OrderByDescending(s => s.DateCreated)
                 .ToListAsync(); ;
        }

        public async Task<Story?> GetStoryByIdAsync(Guid id)
        {
            return await _context.Stories
                .Include(s => s.User)
                .SingleOrDefaultAsync(s => s.Id == id);
        }
    }
}
