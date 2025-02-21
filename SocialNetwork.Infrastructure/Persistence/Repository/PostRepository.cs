
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Infrastructure.DBContext;
using System.Linq;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public PostRepository(AppDbContext context, IHttpContextAccessor contextAccessor)
        {
            _context = context;
            _contextAccessor = contextAccessor;
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
                 .Where(p => (p.IsGroupPost && p.Group != null) || !p.IsGroupPost)
                 .ToListAsync();

            return posts;     
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPostsByUserIdAsync(string userId, int page, int size, string search, string sortOrder, string contentType, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            var currentUserId = _contextAccessor?.HttpContext?.User.GetUserId();

            if(currentUserId == userId)
            {
                return await GetAllMyPostsAsync(userId, page, size, search, sortOrder, contentType, fromDate, toDate);
            }

            var friendShip = await _context.FriendShips
               .Include(f => f.User)
               .Include(f => f.Friend)
               .SingleOrDefaultAsync(s =>
                    ((s.UserId == userId && s.FriendId == currentUserId)
                    || (s.UserId == currentUserId && s.FriendId == userId))
                    && s.Status.Equals(FriendShipStatus.ACCEPTED));

            var query = _context.Posts
                .Include(p => p.Tags).Include(p => p.User)
                .Where(p => 
                   (p.UserId == userId || (friendShip != null && (p.Privacy == PrivacyConstant.PUBLIC || p.UserId == currentUserId) && p.Tags != null && p.Tags.Any(tag => tag.UserId == userId)))
                   && p.GroupId == null
               );

            if(friendShip == null)
            {
                query = query.Where(p => p.Privacy == PrivacyConstant.PUBLIC);
            } else
            {
                query = query.Where(p => p.Privacy == PrivacyConstant.FRIENDS || p.Privacy == PrivacyConstant.PUBLIC);
            }

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
            } else
            {
                query = query.OrderBy(p => p.DateCreated);
            }

            var totalCount = await query.CountAsync();

            var posts = await query
                .Skip((page - 1) * size)
                .Take(size)
                .Include(p => p.Group)
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.Medias)
                .Include(p => p.Tags).ThenInclude(p => p.User)
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
            var userId = _contextAccessor?.HttpContext?.User.GetUserId();
            var meInGroup = await _context.GroupMembers
                .SingleOrDefaultAsync(s => s.UserId == userId && s.GroupId == groupId);

            var blockedUsers = await _context.BlockLists
               .Where(b => b.BlockerId == userId || b.BlockeeId == userId)
               .Select(b => b.BlockerId == userId ? b.BlockeeId : b.BlockerId)
               .ToListAsync();

            var query = _context.Posts
                .Where(p => 
                    p.IsGroupPost && 
                    (!blockedUsers.Contains(p.UserId) || (meInGroup != null && meInGroup.Role != MemberRole.MEMBER)) 
                    && p.ApprovalStatus == ApprovalStatus.APPROVED 
                    && p.GroupId == groupId)
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
            var blockedUsers = await _context.BlockLists
                 .Where(b => b.BlockerId == userId || b.BlockeeId == userId)
                 .Select(b => b.BlockerId == userId ? b.BlockeeId : b.BlockerId)
                 .ToListAsync();

            var query = _context.Posts
                .Include(p => p.Group)
                .ThenInclude(p => p.Members)
                .Where(p => p.Group != null
                    && (
                        (_context.GroupMembers
                            .Where(m => m.UserId == userId && m.GroupId == p.GroupId.Value)
                            .Any(m => m.Role != MemberRole.MEMBER)
                        ) || !blockedUsers.Contains(p.UserId)
                    )
                    && p.ApprovalStatus == ApprovalStatus.APPROVED);

            var totalCount = await query.CountAsync();

            var posts = await query
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
            var userId = _contextAccessor?.HttpContext?.User.GetUserId();

            var blockedUsers = await _context.BlockLists
               .Where(b => b.BlockerId == userId || b.BlockeeId == userId)
               .Select(b => b.BlockerId == userId ? b.BlockeeId : b.BlockerId)
               .ToListAsync();

            var query = _context.Posts
             .Where(p => p.Content.ToLower().Contains(key))
             .Where(p =>
                 !blockedUsers.Contains(p.UserId) && // Không bị chặn hoặc không chặn chủ bài viết
                 (
                     p.Group == null || // Bài viết không thuộc nhóm
                     p.Group.Privacy == GroupPrivacy.PUBLIC || // Bài viết thuộc nhóm công khai
                     (p.Group.Privacy == GroupPrivacy.PRIVATE && // Nhóm riêng tư: Người dùng phải là thành viên
                         _context.GroupMembers.Any(m => m.UserId == userId && m.GroupId == p.GroupId.Value) &&
                         (
                             !blockedUsers.Contains(p.UserId) || // Nếu bị chặn, thì cần quyền cao hơn MEMBER
                             _context.GroupMembers.Any(m => m.UserId == userId && m.GroupId == p.GroupId.Value && m.Role != MemberRole.MEMBER)
                         )
                     )
                 )
             );


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
                    PostContentType.TEXT => query.Where(p => (p.Medias == null || p.Medias.Count == 0) && p.Background == null && p.PostType != PostType.SHARE_POST),
                    PostContentType.MEDIA => query.Where(p => p.Medias != null && p.Medias.Count > 0),
                    PostContentType.BACKGROUND => query.Where(p => p.Background != null),
                    PostContentType.SHARE => query.Where(p => p.PostType == PostType.SHARE_POST),
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
                 .Include(p => p.OriginalPost).ThenInclude(o => o.Tags).ThenInclude(o => o.User)
                .ToListAsync();

            return (posts, totalCount);
        }

        public async Task<(List<Post> Posts, int TotalCount)> GetAllPostsContainsKey(string key, int page, int size, string sortOrder, string contentType, DateTimeOffset? fromDate, DateTimeOffset? toDate)
        {
            var userId = _contextAccessor?.HttpContext?.User.GetUserId();

            var blockedUsers = await _context.BlockLists
               .Where(b => b.BlockerId == userId || b.BlockeeId == userId)
               .Select(b => b.BlockerId == userId ? b.BlockeeId : b.BlockerId)
               .ToListAsync();

            var query = _context.Posts
             .Where(p =>
                 !blockedUsers.Contains(p.UserId) && // Không bị chặn hoặc không chặn chủ bài viết
                 (
                     p.Group == null || // Bài viết không thuộc nhóm
                     p.Group.Privacy == GroupPrivacy.PUBLIC || // Bài viết thuộc nhóm công khai
                     (p.Group.Privacy == GroupPrivacy.PRIVATE && // Nhóm riêng tư: Người dùng phải là thành viên
                         _context.GroupMembers.Any(m => m.UserId == userId && m.GroupId == p.GroupId.Value) &&
                         (
                             !blockedUsers.Contains(p.UserId) || // Nếu bị chặn, thì cần quyền cao hơn MEMBER
                             _context.GroupMembers.Any(m => m.UserId == userId && m.GroupId == p.GroupId.Value && m.Role != MemberRole.MEMBER)
                         )
                     )
             )
            );

            if (!string.IsNullOrWhiteSpace(key))
            {
                query = query.Where(p => p.Content.ToLower().Contains(key.ToLower()));
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
                    PostContentType.TEXT => query.Where(p => (p.Medias == null || p.Medias.Count == 0) && p.Background == null && p.PostType != PostType.SHARE_POST),
                    PostContentType.MEDIA => query.Where(p => p.Medias != null && p.Medias.Count > 0),
                    PostContentType.BACKGROUND => query.Where(p => p.Background != null),
                    PostContentType.SHARE => query.Where(p => p.PostType == PostType.SHARE_POST),
                    _ => query
                };
            }

            if (sortOrder.Equals("asc", StringComparison.OrdinalIgnoreCase))
            {
                query = query.OrderBy(p => p.DateCreated);
            }
            else
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
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.User)
                .Include(p => p.OriginalPost)
                    .ThenInclude(p => p.Medias)
                .ToListAsync();

            return (posts, totalCount);
        }
    }
}
