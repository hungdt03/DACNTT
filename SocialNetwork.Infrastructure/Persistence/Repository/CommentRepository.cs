
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _dbContext;

        public CommentRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int> CountCommentsByPostIdAsync(Guid postId)
        {
            return await _dbContext.Comments.CountAsync(s => s.PostId == postId);
        }

        public async Task<Comment> CreateCommentAsync(Comment comment)
        {
            return (await _dbContext.Comments.AddAsync(comment)).Entity;
        }

        public async Task<List<Comment>> GetAllCommentsByPostIdAndParentCommentIdAsync(Guid postId, Guid? parentCommentId)
        {
            return await _dbContext.Comments
                .Include(cmt => cmt.User)
                .Include(cmt => cmt.Replies)
                .Where(cmt => cmt.ParentCommentId == parentCommentId && cmt.PostId == postId)
                .ToListAsync();
        }

        public async Task<(List<Comment> Comments, int TotalCount)> GetAllRepliesByCommentIdAsync(Guid commentId, int pageNumber, int pageSize)
        {
            var query = _dbContext.Comments.Where(c => c.ParentCommentId == commentId);

            var totalCount = await query.CountAsync();

            var comments = await query
                .Include(c => c.User)
                .Include(c => c.Replies)
                .OrderBy(c => c.DateCreated)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (comments, totalCount);
        }

        public async Task<List<Comment>> GetAllRepliesByCommentIdAsync(Guid commentId)
        {
            return await _dbContext.Comments.Where(c => c.ParentCommentId == commentId)
                .Include(c => c.User)
                .Include(c => c.Replies)
                .OrderBy(c => c.DateCreated)
                .ToListAsync();
        }

        public async Task<(List<Comment> Comments, int TotalCount)> GetAllRootCommentsByPostAsync(Guid postId, int pageNumber, int pageSize)
        {
            var query = _dbContext.Comments.Where(c => c.ParentCommentId == null && c.PostId == postId);

            var totalCount = await query.CountAsync();

            var comments = await query
                .Include(c => c.User)
                .Include(c => c.Replies)
                .OrderByDescending(c => c.DateCreated)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (comments, totalCount);
        }

        public async Task<List<Comment>> GetAllRootCommentsByPostIdAsync(Guid postId)
        {
            return await _dbContext.Comments
                .Include(cmt => cmt.User)
                .Include(cmt => cmt.Replies)
                .Where(cmt => cmt.ParentCommentId == null && cmt.PostId == postId)
                .ToListAsync();
        }

        public async Task<Comment?> GetCommentByIdAsync(Guid id)
        {
            return await _dbContext.Comments
                .SingleOrDefaultAsync(c => c.Id == id);
        }

    }
}
