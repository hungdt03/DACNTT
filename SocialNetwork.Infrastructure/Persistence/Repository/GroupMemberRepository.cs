
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class GroupMemberRepository : IGroupMemberRepository
    {
        private readonly AppDbContext _context;

        public GroupMemberRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CountAdminsByGroupIdAsync(Guid groupId)
        {
            return await _context.GroupMembers
                .Where(m => m.GroupId == groupId && m.Role == MemberRole.ADMIN)
                .CountAsync();
        }

        public async Task<int> CountGroupMembersByGroupIdAsync(Guid groupId)
        {
            return await _context.GroupMembers.Where(m => m.GroupId == groupId).CountAsync();
        }

        public async Task CreateGroupMemberAsync(GroupMember groupMember)
        {
            await _context.GroupMembers.AddAsync(groupMember);
        }

        public async Task<(IEnumerable<GroupMember> Members, int TotalCount)> GetAllMembersInGroupAsync(Guid groupId, int page, int size)
        {
            var queryable = _context.GroupMembers.Where(m => m.GroupId == groupId)
               .AsQueryable();

            var totalCount = await queryable.CountAsync();

            var members = await queryable
                .OrderByDescending(m => m.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .Include(m => m.User)
                .ToListAsync();

            return (members, totalCount);
        }

        public async Task<(IEnumerable<GroupMember> Members, int TotalCount)> GetAllNonAdminMembersInGroupAsync(Guid groupId, int page, int size)
        {
            var queryable = _context.GroupMembers.Where(m => m.GroupId == groupId && m.Role != MemberRole.ADMIN)
                .AsQueryable();

            var totalCount = await queryable.CountAsync();

            var members = await queryable
                .OrderByDescending(m => m.DateCreated)
                .Skip((page - 1) * size)
                .Take(size)
                .Include(m => m.User)
                .ToListAsync();

            return (members, totalCount);
        }

        public async Task<GroupMember?> GetGroupMemberByIdAsync(Guid groupMemberId)
        {
            return await _context.GroupMembers
                .Include(m => m.User)
                .SingleOrDefaultAsync(g => g.Id == groupMemberId);
        }

        public void RemoveGroupMember(GroupMember groupMember)
        {
            _context.GroupMembers.Remove(groupMember);
        }

        async Task<GroupMember?> IGroupMemberRepository.GetGroupMemberByGroupIdAndUserId(Guid groupId, string userId)
        {
            return await _context.GroupMembers
                .Include(m => m.User)
                .Include(m => m.Group)
                .SingleOrDefaultAsync(g => g.GroupId == groupId && g.UserId == userId); 
        }
    }
}
