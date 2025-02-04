
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.PostInfo;
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
                 .Include(p => p.Group)
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
                if (post.IsGroupPost && post.ApprovalStatus != ApprovalStatus.APPROVED) continue;

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
            var query = _context.Posts
                .Where(p => p.UserId == userId && ((p.IsGroupPost && p.ApprovalStatus == ApprovalStatus.APPROVED) || !p.IsGroupPost))
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var posts = await query
                //.AsNoTracking()
                .OrderByDescending(p => p.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .Include(p => p.Group)
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
                .Include(p => p.Group)
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
                .Include(p => p.Group)
                .Include(p => p.SharePost)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.User)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.Medias)
                .SingleOrDefaultAsync(p => p.Id == id);
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPostsByGroupIdAsync(Guid groupId, int page, int size)
        {
            var query = _context.Posts
                .Where(p => p.IsGroupPost && p.ApprovalStatus == ApprovalStatus.APPROVED && p.GroupId == groupId)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var posts = await query
                .OrderByDescending(p => p.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .Include(p => p.User)
                .Include(p => p.Group)
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

        public async Task<(List<Post> Posts, int TotalCount)> GetAllGroupPostsByUserIdAsync(string userId, int page, int size)
        {
            var query = _context.Posts
                .Where(p => p.ApprovalStatus == ApprovalStatus.APPROVED && p.IsGroupPost && p.Group != null && p.Group.Members != null && p.Group.Members.Any(m => m.UserId == userId))
                .Include(p => p.Group)
                    .ThenInclude(p => p.Members)
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var posts = await query
                .OrderByDescending(p => p.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .Include(p => p.Group)
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

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPendingPostsByGroupIdAsync(Guid groupId, int page, int size, string sortOrder, string query, string? userId, string contentType, DateTimeOffset? date)
        {
            var queryable = _context.Posts
                .AsNoTracking() 
                .Where(p => p.IsGroupPost && p.ApprovalStatus == ApprovalStatus.PENDING && p.GroupId == groupId);

            if (!string.IsNullOrEmpty(query))
            {
                queryable = queryable.Where(p => p.Content.ToLower().Contains(query.ToLower()));
            }

            if (date.HasValue)
            {
                var startDate = date.Value.Date;
                var endDate = startDate.AddDays(1);
                queryable = queryable.Where(p => p.DateCreated >= startDate && p.DateCreated < endDate);
            }

            if (!string.IsNullOrEmpty(userId))
            {
                queryable = queryable.Where(p => p.UserId == userId);
            }

            if (contentType != "ALL")
            {
                queryable = contentType switch
                {
                    PostContentType.TEXT => queryable.Where(p => (p.Medias == null || p.Medias.Count == 0) && p.Background == null && p.OriginalPostId == null),
                    PostContentType.MEDIA => queryable.Where(p => p.Medias != null && p.Medias.Count > 0),
                    PostContentType.BACKGROUND => queryable.Where(p => p.Background != null),
                    PostContentType.SHARE => queryable.Where(p => p.OriginalPostId != null),
                    _ => queryable
                };
            }

            if (sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase))
            {
                queryable = queryable.OrderByDescending(p => p.DateCreated);
            }

            var totalCount = await queryable.CountAsync();

            var posts = await queryable
                .Skip((page - 1) * size)
                .Take(size)
                .Include(p => p.Group)
                .Include(p => p.User)
                .Include(p => p.Tags)
                    .ThenInclude(p => p.User)
                .Include(p => p.Medias)
                .ToListAsync();

            return (posts, totalCount);
        }

        public async Task<int> CountPendingPostsByGroupIdAsync(Guid groupId)
        {
            return await _context.Posts.Where(p => p.IsGroupPost && p.ApprovalStatus == ApprovalStatus.PENDING && p.GroupId == groupId).CountAsync();
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPostsContainsKey(string key, int page, int size)
        {
            var query = _context.Posts
                .Where(p => p.Content.ToLower().Contains(key))
                .AsQueryable();

            var totalCount = await query.CountAsync();

            var posts = await query
                 .Skip((page - 1) * size)
                .Take(size)
                .Include(p => p.Group)
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

    }
}
