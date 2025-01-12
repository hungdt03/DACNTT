
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Exceptions;
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

        public async Task<List<Comment>> GetNearbyCommentsByPostAsync(Guid postId, Guid commentId)
        {
            // Tìm comment cần xử lý
            var comment = await _dbContext.Comments
                .Include(cmt => cmt.ParentComment)
                    .ThenInclude(cmt => cmt.ParentComment)
                .SingleOrDefaultAsync(cmt => cmt.Id == commentId)
                ?? throw new NotFoundException("Comment không tồn tại");

            var isRootComment = comment.ParentCommentId == null;

            if (isRootComment)
            {
                // Comment gốc, lấy 5 comment trước và sau trong cùng cấp
                var allRootComments = await _dbContext.Comments
                    .Include(c => c.User)
                    .Include(c => c.Replies)
                    .Where(cmt => cmt.PostId == postId && cmt.ParentCommentId == null)
                    .OrderByDescending(cmt => cmt.DateCreated) // Sắp xếp theo thời gian
                    .ToListAsync();

                var index = allRootComments.FindIndex(cmt => cmt.Id == commentId);
                var nearbyComments = allRootComments
                    .Skip(Math.Max(0, index - 5)) // Lấy 5 comment trước
                    .Take(11) // Lấy tổng 11 comment (bao gồm comment cần tìm)
                    .ToList();

                return nearbyComments;
            }
            else
            {
                while (comment.ParentComment != null)
                {
                    comment = comment.ParentComment;
                }

                // Lấy tất cả các comment cùng cấp với rootComment
                var allRootComments = await _dbContext.Comments
                    .Include(c => c.User)
                    .Include(c => c.Replies)
                    .Where(cmt => cmt.PostId == postId && cmt.ParentCommentId == null)
                    .OrderBy(cmt => cmt.DateCreated)
                    .ToListAsync();

                // Tìm vị trí rootComment
                var indexRoot = allRootComments.FindIndex(cmt => cmt.Id == comment.Id);
                var nearbyRootComments = allRootComments
                    .Skip(Math.Max(0, indexRoot - 5))
                    .Take(11)
                    .ToList();


                // Duyệt từng cấp nhánh
                var currentComment = comment;
                while (currentComment.Id != comment.Id)
                {
                    // Lấy các comment con ở cấp hiện tại
                    var childComments = await _dbContext.Comments
                        .Include(c => c.User)
                        .Include(c => c.Replies)
                        .Where(cmt => cmt.ParentCommentId == currentComment.Id)
                        .OrderBy(cmt => cmt.DateCreated)
                        .ToListAsync();

                    // Tìm vị trí của comment cần tìm hoặc `currentComment` tại cấp này
                    var indexChild = childComments.FindIndex(cmt => cmt.Id == comment.Id || cmt.Id == currentComment.Id);

                    // Lấy 5 comment trước và 5 comment sau
                    var nearbyChildComments = childComments
                        .Skip(Math.Max(0, indexChild - 5))
                        .Take(11)
                        .ToList();

                    // Thêm các comment con vào Replies của currentComment
                    currentComment.Replies = nearbyChildComments;

                    // Cập nhật currentComment để tiếp tục duyệt cấp tiếp theo
                    currentComment = nearbyChildComments.FirstOrDefault(cmt => cmt.Id == comment.Id) ?? currentComment;
                }

                return nearbyRootComments;
            }
        }
    }
}
