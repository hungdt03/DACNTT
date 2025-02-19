﻿
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

        public async Task<List<Post>> GetAllPostsAsync()
        {
            var posts = await _context.Posts
                 .Include(p => p.User)
                 .Include(p => p.Group)
                 .Include(p => p.Tags).ThenInclude(t => t.User)
                 .Include(p => p.Comments)
                 .Include(p => p.Medias)
                 .Include(p => p.SharePost)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.User)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Medias)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Group)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Tags).ThenInclude(o => o.User)
                 .ToListAsync();

            return posts;     
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPostsByUserIdAsync(string userId, int page, int size, string search, string sortOrder, string contentType, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            var query = _context.Posts
                .Where(p => p.UserId == userId && p.GroupId == null)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Content.ToLower().Contains(search.ToLower()));
            }

            if (fromDate.HasValue)
            {
                var startDate = fromDate.Value.Date;
                query = query.Where(p => p.DateCreated.Date >= startDate);
            }

            if (toDate.HasValue)
            {
                var endDate = toDate.Value.Date;
                query = query.Where(p => p.DateCreated.Date <= endDate);
            }


            if (contentType != "ALL")
            {
                query = contentType switch
                {
                    PostContentType.TEXT => query.Where(p => (p.Medias == null || p.Medias.Count == 0) && p.Background == null && p.OriginalPostId == null),
                    PostContentType.MEDIA => query.Where(p => p.Medias != null && p.Medias.Count > 0),
                    PostContentType.BACKGROUND => query.Where(p => p.Background != null),
                    PostContentType.SHARE => query.Where(p => p.OriginalPostId != null),
                    _ => query
                };
            }

            if (sortOrder.Equals("desc", StringComparison.OrdinalIgnoreCase))
            {
                query = query.OrderByDescending(p => p.DateCreated);
            }

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
                  .Include(p => p.OriginalPost).ThenInclude(o => o.User)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Medias)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Group)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Tags).ThenInclude(o => o.User)
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
                 .Include(p => p.OriginalPost).ThenInclude(o => o.User)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Medias)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Group)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Tags).ThenInclude(o => o.User)
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
                  .Include(p => p.OriginalPost).ThenInclude(o => o.User)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Medias)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Group)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Tags).ThenInclude(o => o.User)
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
                .Include(p => p.Medias)
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

        public async Task<int> CountPostsByUserIdAsync(string userId)
        {
            return await _context.Posts.Where(p => p.OriginalPostId == null && p.UserId == userId).CountAsync();
        }

        public async Task<int> CountSharePostsByUserIdAsync(string userId)
        {
            return await _context.Posts.Where(p => p.OriginalPostId != null && p.UserId == userId).CountAsync();
        }

        public async Task<int> CountTodayPostsByGroupIdAsync(Guid groupId)
        {
            return await _context.Posts
                .Where(p => p.IsGroupPost && p.GroupId == groupId && p.DateCreated.Date == DateTimeOffset.UtcNow.Date).CountAsync();
        }

        public async Task DeleteManyPost(List<string> listPostId)
        {
            await _context.Posts
                .Where(u => listPostId.Contains(u.Id.ToString()))
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(u => u.IsDeleted, true)
                    .SetProperty(u => u.DeletedAt, DateTime.UtcNow)
                );
        }

        public async Task DeleteAllPost()
        {
            await _context.Posts
               .ExecuteUpdateAsync(setters => setters
                   .SetProperty(u => u.IsDeleted, true)
                   .SetProperty(u => u.DeletedAt, DateTime.UtcNow)
               );
        }

        public async Task<List<Post>> GetAllGroupPostsByGroupIdAsync(Guid groupId)
        {
            var posts = await _context.Posts
                  .Where(p => p.IsGroupPost && p.GroupId == groupId)
                 .Include(p => p.User)
                 .Include(p => p.Group)
                 .Include(p => p.Tags).ThenInclude(t => t.User)
                 .Include(p => p.Comments)
                 .Include(p => p.Medias)
                 .Include(p => p.SharePost)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.User)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Medias)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Group)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Tags)
                 .ToListAsync();

            return posts;
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllMemberGroupPostsByGroupIdAsync(Guid groupId, string userId, int page, int size)
        {
            var query = _context.Posts
               .Where(p => p.IsGroupPost && p.GroupId == groupId && p.UserId == userId)
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
                .ToListAsync();

            return (posts, totalCount);
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllGroupPostsByGroupIdAndUserIdAndStatus(Guid groupId, string userId, string status, int page, int size)
        {
            var query = _context.Posts
               .Where(p => p.IsGroupPost && p.ApprovalStatus == status && p.UserId == userId && p.GroupId == groupId)
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
                  .Include(p => p.OriginalPost).ThenInclude(o => o.User)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Medias)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Group)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Tags)
                .ToListAsync();

            return (posts, totalCount);
        }
        public async Task<int> CountAllPost()
        {
            return await _context.Posts.CountAsync();
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllMyPostsAsync(string userId, int page, int size, string search, string sortOrder, string contentType, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            var query = _context.Posts
                   .Include(o => o.Tags)
                   .ThenInclude(t => t.User)
               .Where(p =>
                   (p.UserId == userId || (p.Tags != null && p.Tags.Any(tag => tag.UserId == userId)))
                   && p.GroupId == null
               );

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Content.ToLower().Contains(search.ToLower()));
            }

            if (fromDate.HasValue)
            {
                var startDate = fromDate.Value.Date;
                query = query.Where(p => p.DateCreated.Date >= startDate);
            }

            if (toDate.HasValue)
            {
                var endDate = toDate.Value.Date;
                query = query.Where(p => p.DateCreated.Date <= endDate);
            }


            if (contentType != "ALL")
            {
                query = contentType switch
                {
                    PostContentType.TEXT => query.Where(p => (p.Medias == null || p.Medias.Count == 0) && p.Background == null && p.OriginalPostId == null),
                    PostContentType.MEDIA => query.Where(p => p.Medias != null && p.Medias.Count > 0),
                    PostContentType.BACKGROUND => query.Where(p => p.Background != null),
                    PostContentType.SHARE => query.Where(p => p.OriginalPostId != null),
                    _ => query
                };
            }

            if (sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase))
            {
                query = query.OrderBy(p => p.DateCreated);
            } else
            {
                query = query.OrderByDescending(p => p.DateCreated);
            }

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
                  .Include(p => p.OriginalPost).ThenInclude(o => o.User)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Medias)
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Group)
              
                .ToListAsync();

            return (posts, totalCount);
        }
    }
}
