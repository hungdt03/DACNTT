using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IPostMediaRepository
    {
        Task<PostMedia?> GetPostMediaByIdAsync(Guid postId);
        void DeletePostMedia(PostMedia media);
        Task<(List<PostMedia> Images, int TotalCount)> GetAllGroupImagesByGroupId(Guid groupId, int page, int size);

        Task<(List<PostMedia> Images, int TotalCount)> GetPublicPostImagesByUserId(string userId, int page, int size);
        Task<(List<PostMedia> Images, int TotalCount)> GetPublicAndFriendPostImagesByUserId(string userId, int page, int size);
        Task<(List<PostMedia> Images, int TotalCount)> GetAllPostImagesByUserId(string userId, int page, int size);

        Task<(List<PostMedia> Videos, int TotalCount)> GetPublicPostVideosByUserId(string userId, int page, int size);
        Task<(List<PostMedia> Videos, int TotalCount)> GetPublicAndFriendPostVideosByUserId(string userId, int page, int size);
        Task<(List<PostMedia> Videos, int TotalCount)> GetAllPostVideosByUserId(string userId, int page, int size);

        Task<(List<PostMedia> Videos, int TotalCount)> GetAllGroupVideosByGroupId(Guid groupId, int page, int size);
        Task<(List<PostMedia> PostMedias, int TotalCount)> GetAllGroupPostMediaByGroupIdAsync(Guid groupId, int page, int size);
    }
}
