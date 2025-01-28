using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class GroupRepository : IGroupRepository
    {
        private readonly AppDbContext _context;

        public GroupRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateGroupAsync(Group group)
        {
            await _context.Groups.AddAsync(group);
        }

        public async Task<IEnumerable<Group>> GetAllGroupsAsync()
        {
            return await _context.Groups.ToListAsync();
        }

        public async Task<IEnumerable<Group>> GetAllGroupsJoinByUserId(string userId)
        {
            return await _context.Groups
                .Include(g => g.Members)
                    .ThenInclude(g => g.User)
                 .Where(g => g.Members.Any(m => !m.IsAdmin && m.UserId == userId))
                 .ToListAsync();
        }

        public async Task<IEnumerable<Group>> GetAllGroupsManageByUserId(string userId)
        {
            return await _context.Groups
                .Include(g => g.Members)
                 .ThenInclude(g => g.User)
                .Where(g => g.Members.Any(m => m.IsAdmin && m.UserId == userId))
                .ToListAsync();
        }

        public async Task<Group?> GetGroupByIdAsync(Guid groupId)
        {
            return await _context.Groups
                .Include(g => g.Members)
                    .ThenInclude(g => g.User)
                .SingleOrDefaultAsync(g => g.Id == groupId);    
        }
    }
}
