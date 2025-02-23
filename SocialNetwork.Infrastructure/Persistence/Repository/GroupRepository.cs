using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Infrastructure.DBContext;
using System.Linq;

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
        public async Task DeleteOneGroup(Guid id)
        {
            await _context.Groups
                .Where(u => u.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(u => u.IsDeleted, true)
                    .SetProperty(u => u.DeletedAt, DateTimeOffset.UtcNow)
                );
        }

        public async Task DeleteAllGroup()
        {
            await _context.Groups
              .ExecuteUpdateAsync(setters => setters
                  .SetProperty(u => u.IsDeleted, true)
                  .SetProperty(u => u.DeletedAt, DateTimeOffset.UtcNow)
              );
        }

        public async Task DeletManyGroup(List<string> listGroupId)
        {
            await _context.Groups
                .Where(u => listGroupId.Contains(u.Id.ToString()))
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(u => u.IsDeleted, true)
                    .SetProperty(u => u.DeletedAt, DateTimeOffset.UtcNow)
                );
        }

        public async Task<(IEnumerable<Group> Groups, int TotalCount)> GetAllGroupsAsync(int page, int size, string search, string privacy)
        {
            var query = _context.Groups
                 .Where(g => g.Name.ToLower().Contains(search))
                 .AsQueryable();

            if(privacy != "ALL")
            {
                query = privacy switch
                {
                    GroupPrivacy.PUBLIC => query.Where(p => p.Privacy == GroupPrivacy.PUBLIC),
                    GroupPrivacy.PRIVATE => query.Where(p => p.Privacy == GroupPrivacy.PRIVATE),
                    _ => query
                };
            }

            var totalCount = await query.CountAsync();

            var groups = await query
               .Skip((page - 1) * size)
               .Take(size)
                .Include(g => g.Members)
                   .ThenInclude(g => g.User)
               .ToListAsync();

            return (groups, totalCount);
        }

        public async Task<(IEnumerable<Group> Groups, int TotalCount)> GetAllGroupsContainsKey(string key, int page, int size)
        {
            var query = _context.Groups
                .Where(g => g.Name.ToLower().Contains(key))
                .AsQueryable();

            var totalCount = await query.CountAsync();  

            var groups = await query
                .Skip((page - 1) * size)
                .Take(size)
                 .Include(g => g.Members)
                    .ThenInclude(g => g.User)
                .ToListAsync();

            return (groups, totalCount);
        }

        public async Task<IEnumerable<Group>> GetAllGroupsJoinByUserId(string userId)
        {
            return await _context.Groups
                .Include(g => g.Members)
                    .ThenInclude(g => g.User)
                 .Where(g => g.Members.Any(m => m.Role != MemberRole.ADMIN && m.UserId == userId))
                 .ToListAsync();
        }

        public async Task<IEnumerable<Group>> GetAllGroupsManageByUserId(string userId)
        {
            return await _context.Groups
                .Include(g => g.Members)
                 .ThenInclude(g => g.User)
                .Where(g => g.Members.Any(m => m.Role == MemberRole.ADMIN && m.UserId == userId))
                .ToListAsync();
        }

        public async Task<Group?> GetGroupByIdAsync(Guid groupId)
        {
            return await _context.Groups
                .Include(g => g.Members)
                    .ThenInclude(g => g.User)
                .SingleOrDefaultAsync(g => g.Id == groupId);    
        }
        public async Task<Group?> GetGroupByIdIgnoreAsync(Guid groupId)
        {
            return await _context.Groups
                .Include(g => g.Members)
                    .ThenInclude(g => g.User)
                .IgnoreQueryFilters()
                .SingleOrDefaultAsync(g => g.Id == groupId);
        }


        public void RemoveGroup(Group group)
        {
            _context.Groups.Remove(group);
        }
        public async Task<int> CountAllGroup()
        {
            return await _context.Groups.CountAsync();
        }
    }
}
