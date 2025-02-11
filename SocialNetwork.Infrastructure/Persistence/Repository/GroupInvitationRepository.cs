using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class GroupInvitationRepository : IGroupInvitationRepository
    {
        private readonly AppDbContext _context;

        public GroupInvitationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNewGroupInvitationAsync(GroupInvitation groupInvitation)
        {
            await _context.GroupInvitations.AddAsync(groupInvitation);
        }

        public async Task<List<GroupInvitation>> GetAllInvitationsByGroupIdAsync(Guid groupId)
        {
            return await _context.GroupInvitations
                .Where(x => x.GroupId == groupId)
                .ToListAsync();
        }

        public async Task<GroupInvitation?> GetGroupInvitationByIdAsync(Guid id)
        {
            return await _context.GroupInvitations.SingleOrDefaultAsync(x => x.Id == id && x.Status == false);
        }

        public async Task<GroupInvitation?> GetGroupInvitationByInviteeIdAndGroupIdAsync(string inviteeId, Guid groupId)
        {
            return await _context.GroupInvitations
                .Include(g => g.Inviter)
                .Include(g => g.Invitee)
                .SingleOrDefaultAsync(x => x.GroupId == groupId && x.InviteeId == inviteeId && x.Status == false);
        }

        public async Task<GroupInvitation?> GetGroupInvitationByInviterIdAndInviteeIdAndGroupIdAsync(string inviterId, string inviteeId, Guid groupId)
        {
            return await _context.GroupInvitations.SingleOrDefaultAsync(inv => inv.InviterId == inviterId && inv.InviteeId == inviteeId && inv.GroupId == groupId && inv.Status == false);
        }

        public void RemoveGroupInvitation(GroupInvitation groupInvitation)
        {
            _context.GroupInvitations.Remove(groupInvitation);
        }
    }

}
