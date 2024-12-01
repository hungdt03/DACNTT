
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface ICommentRepository
    {
        Task CreateCommentAsync(Comment comment);
        Task<(List<Comment> Comments, int TotalCount)> GetAllRootCommentsByPostAsync(Guid postId, int pageNumber, int pageSize);
        Task<(List<Comment> Comments, int TotalCount)> GetAllRepliesByCommentIdAsync(Guid commentId, int pageNumber, int pageSize);
        Task<Comment?> GetCommentByIdAsync(Guid id); 
    }
}
