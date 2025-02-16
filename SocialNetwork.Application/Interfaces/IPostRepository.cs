using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IPostRepository
    {
        Task CreatePostAsync(Post post);
        Task<List<Post>> GetAllPostsAsync();
        Task<(List<Post> Posts, int TotalCount)> GetAllPostsByUserIdAsync(string userId, int page, int size, string search, string sortOrder, string contentType, DateTimeOffset? fromDate, DateTimeOffset? toDate);
        Task<int> CountPostsByUserIdAsync(string userId);
        Task<int> CountSharePostsByUserIdAsync(string userId);
        Task<(List<Post> Posts, int TotalCount)> GetAllPostsByGroupIdAsync(Guid groupId, int page, int size);
        Task<(List<Post> Posts, int TotalCount)> GetAllGroupPostsByUserIdAsync(string userId, int page, int size);
        Task<(List<Post> Posts, int TotalCount)> GetAllMemberGroupPostsByGroupIdAsync(Guid groupId, string userId, int page, int size);
     
        Task<Post?> GetPostByIdAsync(Guid id);
        Task<int> CountSharesByPostIdAsync(Guid postId);
        Task<(List<Post> Posts, int TotalCount)> GetAllSharesByPostIdAsync(Guid postId, int page, int size);  
        void DeletePost(Post post);
        Task<List<Post>> GetAllSharePostsByOriginalPostId(Guid postId);
        Task<(List<Post> Posts, int TotalCount)> GetAllPendingPostsByGroupIdAsync(Guid groupId, int page, int size, string sortOrder, string query, string? userId, string contentType, DateTimeOffset? date);
        Task<int> CountPendingPostsByGroupIdAsync(Guid groupId);
        Task<int> CountTodayPostsByGroupIdAsync(Guid groupId);
        Task<(List<Post> Posts, int TotalCount)> GetAllPostsContainsKey(string key, int page, int size);
        Task<(List<Post> Posts, int TotalCount)> GetAllGroupPostsByGroupIdAndUserIdAndStatus(Guid groupId, string userId, string status, int page, int size);

        Task DeleteManyPost(List<string> listPostId);
        Task DeleteAllPost();
    }
}
