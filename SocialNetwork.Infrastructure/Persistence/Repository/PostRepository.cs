
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;
using System.Drawing.Printing;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;
        public PostRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CountSharesByPostIdAsync(Guid postId)
        {
            return await _context.Posts.CountAsync(s => s.OriginalPostId == postId);
        }

        public async Task CreatePostAsync(Post post)
        {
            await _context.Posts.AddAsync(post);
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPostsAsync(int page, int size)
        {
            var query = _context.Posts;

            var totalCount = await query.CountAsync();

            var posts = await query
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.Medias)
                .Include(p => p.SharePost)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.User)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.Medias)
                .OrderByDescending(p => p.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (posts, totalCount);
        }

        public async Task<Post?> GetPostByIdAsync(Guid id)
        {
            return await _context.Posts
                .Include(p => p.Medias)
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.SharePost)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.User)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.Medias)
                .SingleOrDefaultAsync(p => p.Id == id);
        }
    }
}
