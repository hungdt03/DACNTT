
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;
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

        public async Task<PostMedia?> GetPostMediaByIdAsync(Guid postId)
        {
            return await _context.PostMedias.SingleOrDefaultAsync(post => post.Id == postId);
        }
    }
}
