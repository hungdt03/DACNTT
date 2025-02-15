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

        public async Task<(List<GroupInvitation> GroupInvitations, int TotalCount)> GetAllPendingInvitationsByGroupIdAsync(Guid groupId, int page, int size)
        {
            var queryable = _context.GroupInvitations
                .Where(inv => inv.GroupId == groupId && inv.Status == true);

            var totalCount = await queryable.CountAsync();

            var invitations = await queryable
                 .OrderByDescending(s => s.DateCreated)
                 .Skip((page - 1) * size)   
                 .Take(size)
                .Include(s => s.Inviter)
                .Include(s => s.Invitee)
                .ToListAsync();

            return (invitations, totalCount);

        }

        public async Task<GroupInvitation?> GetGroupInvitationByIdAsync(Guid id)
        {
            return await _context.GroupInvitations
                .Include(x => x.Group)
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<GroupInvitation?> GetGroupInvitationByInviteeIdAndGroupIdAsync(string inviteeId, Guid groupId)
        {
            return await _context.GroupInvitations
                .Include(g => g.Inviter)
                .Include(g => g.Invitee)
                .SingleOrDefaultAsync(x => x.GroupId == groupId && x.InviteeId == inviteeId);
        }

        public async Task<GroupInvitation?> GetGroupInvitationByInviterIdAndInviteeIdAndGroupIdAsync(string inviterId, string inviteeId, Guid groupId)
        {
            return await _context.GroupInvitations.SingleOrDefaultAsync(inv => inv.InviterId == inviterId && inv.InviteeId == inviteeId && inv.GroupId == groupId);
        }

        public void RemoveGroupInvitation(GroupInvitation groupInvitation)
        {
            _context.GroupInvitations.Remove(groupInvitation);
        }
    }

}
