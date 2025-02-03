
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
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

        public async Task CreateGroupMemberAsync(GroupMember groupMember)
        {
            await _context.GroupMembers.AddAsync(groupMember);
        }

        public async Task<IEnumerable<GroupMember>> GetAllMembersInGroupAsync(Guid groupId)
        {
            return await _context.GroupMembers
                .Include(m => m.User)
                .Where(m  => m.GroupId == groupId).ToListAsync();   
        }

        public async Task<GroupMember?> GetGroupMemberByIdAsync(Guid groupMemberId)
        {
            return await _context.GroupMembers
                .Include(m => m.User)
                .SingleOrDefaultAsync(g => g.Id == groupMemberId);
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
