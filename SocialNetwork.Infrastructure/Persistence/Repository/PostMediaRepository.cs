
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
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

        public async Task<PostMedia?> GetPostMediaByIdAsync(Guid postId)
        {
            return await _context.PostMedias.SingleOrDefaultAsync(post => post.Id == postId);
        }

    }
}
