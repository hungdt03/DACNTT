
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class TagRepository : ITagRepository
    {
        private readonly AppDbContext _context;

        public TagRepository(AppDbContext context)
        {
            _context = context;
        }

        public void DeleteTag(Tag tag)
        {
            _context.Tags.Remove(tag);
        }

        public async Task<Tag?> GetTagByIdAsync(Guid id)
        {
            return await _context.Tags.SingleOrDefaultAsync(t => t.Id == id);
        }
    }
}
