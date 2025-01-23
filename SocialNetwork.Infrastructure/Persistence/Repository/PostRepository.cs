
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

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

        public void DeletePost(Post post)
        {
            _context.Posts.Remove(post);
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPostsAsync(int page, int size, string userId)
        {
            var query = _context.Posts
                 .Include(p => p.User)
                 .Include(p => p.Tags).ThenInclude(t => t.User)
                 .Include(p => p.Comments)
                 .Include(p => p.Medias)
                 .Include(p => p.SharePost)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.User)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Medias)
                 .AsQueryable();

            var totalCount = await query.CountAsync();

            var filteredPosts = new List<Post>();
            foreach (var post in await query.ToListAsync())
            {
                bool isFriend = await _context.FriendShips.AnyAsync(s =>
                    ((s.UserId == post.UserId && s.FriendId == userId) ||
                     (s.UserId == userId && s.FriendId == post.UserId)) &&
                     s.Status.Equals(FriendShipStatus.ACCEPTED));

                bool isMe = post.UserId == userId;

                if (isMe || isFriend || post.Privacy.Equals(PrivacyConstant.PUBLIC) ||
                    (post.Privacy.Equals(PrivacyConstant.FRIENDS)))
                {
                    filteredPosts.Add(post);
                }
            }

            // Phân trang
            var posts = filteredPosts
                .OrderByDescending(p => p.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            return (posts, totalCount);
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPostsByUserIdAsync(string userId, int page, int size)
        {
            var query = _context.Posts.AsQueryable();

            var totalCount = await query.Where(p => p.UserId == userId).CountAsync();

            var posts = await query
                //.AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .Include(p => p.User)
                .Include(p => p.Tags)
                    .ThenInclude(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.Medias)
                .Include(p => p.SharePost)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.User)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.Medias)
                .ToListAsync();

            return (posts, totalCount);
        }

        public async Task<List<Post>> GetAllSharePostsByOriginalPostId(Guid postId)
        {
            return await _context.Posts.Where(p => p.SharePostId == postId || p.OriginalPostId == postId).ToListAsync();   
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllSharesByPostIdAsync(Guid postId, int page, int size)
        {
            var query = _context.Posts.AsQueryable();

            var totalCount = await query.Where(p => p.SharePostId == postId || p.OriginalPostId == postId).CountAsync();

            var posts = await query
                //.AsNoTracking()
                .Where(p => p.SharePostId == postId || p.OriginalPostId == postId)
                .OrderByDescending(p => p.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .Include(p => p.User)
                .Include(p => p.Tags)
                    .ThenInclude(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.Medias)
                .Include(p => p.SharePost)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.User)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.Medias)
                .ToListAsync();

            return (posts, totalCount);
        }

        public async Task<Post?> GetPostByIdAsync(Guid id)
        {
            return await _context.Posts
                .Include(p => p.Medias)
                .Include(p => p.User)
                .Include(p => p.Tags)
                    .ThenInclude(p => p.User)
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
