
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IPostRepository
    {
        Task CreatePostAsync(Post post);
        Task<(List<Post> Posts, int TotalCount)> GetAllPostsAsync(int page, int size);
        Task<Post?> GetPostByIdAsync(Guid id);
        Task<int> CountSharesByPostIdAsync(Guid postId);
    }
}
