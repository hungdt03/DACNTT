
using SocialNetwork.Domain.Entity;

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
        Task<List<Comment>> GetAllRepliesByCommentIdAsync(Guid commentId);
    }
}
