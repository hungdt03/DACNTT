
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class PostMediaRepository : IPostMediaRepository
    {
        private readonly AppDbContext _context;

        public PostMediaRepository(AppDbContext context)
        {
            _context = context;
        }

        public void DeletePostMedia(PostMedia media)
        {
            _context.PostMedias.Remove(media);
        }

        public async Task<(List<PostMedia> Images, int TotalCount)> GetAllGroupImagesByGroupId(Guid groupId, int page, int size)
        {
            var query = _context.PostMedias
                .Include(s => s.Post)
                .Where(s => s.Post.GroupId == groupId && s.MediaType == MediaType.IMAGE)
                .Where(s => s.Post.GroupId == groupId).AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }

        public async Task<(List<PostMedia> PostMedias, int TotalCount)> GetAllGroupPostMediaByGroupIdAsync(Guid groupId, int page, int size)
        {
            var query = _context.PostMedias
                .Include(s => s.Post)
                .Where(s => s.Post.GroupId == groupId).AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }

        public async Task<(List<PostMedia> Videos, int TotalCount)> GetAllGroupVideosByGroupId(Guid groupId , int page, int size)
        {
            var query = _context.PostMedias
                .Include(s => s.Post)
                .Where(s => s.Post.GroupId == groupId && s.MediaType == MediaType.VIDEO)  
                .AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }

        public async Task<(List<PostMedia> Images, int TotalCount)> GetAllPostImagesByUserId(string userId, int page, int size)
        {
            var query = _context.PostMedias
               .Include(s => s.Post)
               .Where(s => s.Post.UserId == userId && s.MediaType == MediaType.IMAGE)
               .AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }

        public async Task<(List<PostMedia> Videos, int TotalCount)> GetAllPostVideosByUserId(string userId, int page, int size)
        {
            var query = _context.PostMedias
              .Include(s => s.Post)
              .Where(s => s.Post.UserId == userId && s.MediaType == MediaType.VIDEO)
              .AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }

        public async Task<PostMedia?> GetPostMediaByIdAsync(Guid postId)
        {
            return await _context.PostMedias.SingleOrDefaultAsync(post => post.Id == postId);
        }

        public async Task<(List<PostMedia> Images, int TotalCount)> GetPublicAndFriendPostImagesByUserId(string userId, int page, int size)
        {
            var query = _context.PostMedias
              .Include(s => s.Post)
              .Where(s => (s.Post.Privacy == PrivacyConstant.PUBLIC || s.Post.Privacy == PrivacyConstant.FRIENDS) && s.Post.UserId == userId && s.MediaType == MediaType.IMAGE)
              .AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }

        public async Task<(List<PostMedia> Videos, int TotalCount)> GetPublicAndFriendPostVideosByUserId(string userId, int page, int size)
        {
            var query = _context.PostMedias
              .Include(s => s.Post)
              .Where(s => (s.Post.Privacy == PrivacyConstant.PUBLIC || s.Post.Privacy == PrivacyConstant.FRIENDS) && s.Post.UserId == userId && s.MediaType == MediaType.VIDEO)
              .AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }

        public async Task<(List<PostMedia> Images, int TotalCount)> GetPublicPostImagesByUserId(string userId, int page, int size)
        {
            var query = _context.PostMedias
              .Include(s => s.Post)
              .Where(s => s.Post.Privacy == PrivacyConstant.PUBLIC && s.Post.UserId == userId && s.MediaType == MediaType.IMAGE)
              .AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }

        public async Task<(List<PostMedia> Videos, int TotalCount)> GetPublicPostVideosByUserId(string userId, int page, int size)
        {
            var query = _context.PostMedias
             .Include(s => s.Post)
             .Where(s => s.Post.Privacy == PrivacyConstant.PUBLIC && s.Post.UserId == userId && s.MediaType == MediaType.VIDEO)
             .AsQueryable();

            var totalCount = await query.CountAsync();
            var medias = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (medias, totalCount);
        }
    }
}
