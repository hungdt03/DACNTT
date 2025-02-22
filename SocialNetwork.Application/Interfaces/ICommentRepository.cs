using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface ICommentRepository
    {
        Task<Comment> CreateCommentAsync(Comment comment);
        Task<(List<Comment> Comments, int TotalCount)> GetAllRootCommentsByPostAsync(Guid postId, int pageNumber, int pageSize);
        Task<(List<Comment> Comments, int TotalCount)> GetAllRepliesByCommentIdAsync(Guid commentId, int pageNumber, int pageSize);
        Task<Comment?> GetCommentByIdAsync(Guid id);
        Task<int> CountCommentsByPostIdAsync(Guid postId);
        Task<List<Comment>> GetAllRootCommentsByPostIdAsync(Guid postId);
        Task<List<Comment>> GetAllCommentsByPostIdAndParentCommentIdAsync(Guid postId, Guid? parentCommentId);
        Task<List<Comment>> GetAllRepliesByCommentIdAsync(Guid commentId);
        Task<List<Comment>> GetAllCommentsByPostIdAsync(Guid postId);
        void DeleteComment(Comment comment);
        void RemoveRange(IEnumerable<Comment> comments);
        Task<int> CountCommentsByUserIdAsync(string userId);
        Task<Comment?> GetFirstCommentByPostId(Guid postId);
        Task<Comment?> GetCommentByIdIgnoreAsync(Guid id);
    }
}
