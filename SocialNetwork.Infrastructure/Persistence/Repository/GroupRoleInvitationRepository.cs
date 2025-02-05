
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class GroupRoleInvitationRepository : IGroupRoleInvitationRepository
    {
        private readonly AppDbContext _context;

        public GroupRoleInvitationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> AnyRoleInvitaionAsync(string inviteeId, Guid groupId)
        {
            return await _context.GroupRoleInvitations
                .AnyAsync(inv => inv.InviteeId == inviteeId && inv.GroupId == groupId);
        }

        public async Task CreateNewInvitationAsync(GroupRoleInvitation groupRoleInvitation)
        {
            await _context.GroupRoleInvitations.AddAsync(groupRoleInvitation);
        }

        public async Task<GroupRoleInvitation?> GetAdminInvitationByInviteeAndGroupIdAsync(string userId, Guid groupId)
        {
            return await _context.GroupRoleInvitations
                .SingleOrDefaultAsync(g => g.InviteeId == userId && g.GroupId == groupId && g.Role == MemberRole.ADMIN);
        }

        public async Task<List<GroupRoleInvitation>> GetAllByGroupIdAsync(Guid groupId)
        {
            return await _context.GroupRoleInvitations
                .Where(i => i.GroupId == groupId).ToListAsync();
        }

        public async Task<GroupRoleInvitation?> GetByIdAsync(Guid id)
        {
            return await _context.GroupRoleInvitations
                .SingleOrDefaultAsync(g => g.Id == id);
        }

        public async Task<GroupRoleInvitation?> GetInvitationByInviteeAndGroupIdAsync(string userId, Guid groupId)
        {
            return await _context.GroupRoleInvitations
                .SingleOrDefaultAsync(g => g.InviteeId == userId && g.GroupId == groupId);
        }

        public async Task<GroupRoleInvitation?> GetModeratorInvitationByInviteeAndGroupIdAsync(string userId, Guid groupId)
        {
            return await _context.GroupRoleInvitations
                .SingleOrDefaultAsync(g => g.InviteeId == userId && g.GroupId == groupId && g.Role == MemberRole.MODERATOR);
        }

        public void RemoveRoleInvitation(GroupRoleInvitation groupRoleInvitation)
        {
            _context.GroupRoleInvitations.Remove(groupRoleInvitation);
        }
    }
}
