
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;
using System.ComponentModel.Design;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _dbContext;

        public CommentRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateCommentAsync(Comment comment)
        {
            await _dbContext.Comments.AddAsync(comment);
        }

        public async Task<(List<Comment> Comments, int TotalCount)> GetAllRepliesByCommentIdAsync(Guid commentId, int pageNumber, int pageSize)
        {
            var query = _dbContext.Comments.Where(c => c.ParentCommentId == commentId);

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

        public async Task<Comment?> GetCommentByIdAsync(Guid id)
        {
            return await _dbContext.Comments
                .SingleOrDefaultAsync(c => c.Id == id);
        }

    }
}
