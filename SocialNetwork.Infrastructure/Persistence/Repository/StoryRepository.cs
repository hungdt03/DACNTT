
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class StoryRepository : IStoryRepository
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ILogger<StoryRepository> _logger;

        public StoryRepository(AppDbContext context, IHttpContextAccessor contextAccessor, ILogger<StoryRepository> logger)
        {
            _context = context;
            _contextAccessor = contextAccessor;
            _logger = logger;
        }

        public async Task<int> CountStoriesByUserIdAsync(string userId)
        {
            return await _context.Stories
                .Where(s => s.UserId == userId).CountAsync();
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
                .Where(s => s.ExpiresAt > DateTimeOffset.UtcNow)
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

        public async Task<bool> IsUserHaveStoryAsync(string userId)
        {
            var myId = _contextAccessor?.HttpContext?.User.GetUserId();
            _logger.LogInformation("=============================LOG ID IN STORY REPOSITORY=============================");
            _logger.LogInformation(myId);

            var stories = await _context.Stories
               .Where(s => s.UserId == userId && s.ExpiresAt > DateTimeOffset.UtcNow).ToListAsync();

            var takeStories = new List<Domain.Entity.StoryInfo.Story>();

            if (userId == myId)
            {
                takeStories = [.. stories];
            }
            else
            {
                foreach (var story in stories)
                {
                    if (story.Privacy == PrivacyConstant.PRIVATE) continue;

                    if (story.Privacy == PrivacyConstant.FRIENDS)
                    {
                        var friendShip = await _context.FriendShips
                           .SingleOrDefaultAsync(s =>
                                ((s.UserId == userId && s.FriendId == myId)
                                || (s.UserId == myId && s.FriendId == userId))
                                && s.Status.Equals(FriendShipStatus.ACCEPTED));

                        if (friendShip == null)
                        {
                            continue;
                        }
                    }

                    takeStories.Add(story);
                }

            }

            return takeStories.Count != 0;
        }
    }
}
