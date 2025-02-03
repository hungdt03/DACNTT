using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class JoinGroupRequestRepository : IJoinGroupRequestRepository
    {
        private readonly AppDbContext _context;

        public JoinGroupRequestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CountPendingJoinGroupRequestedAsync(Guid groupId)
        {
            return await _context.JoinGroupRequests
                .Where(j => j.GroupId == groupId)   
                .CountAsync();
        }

        public async Task CreateJoinGroupRequestAsync(JoinGroupRequest request)
        {
            await _context.JoinGroupRequests.AddAsync(request);
        }

        public async Task<JoinGroupRequest?> GetJoinGroupRequestByIdAsync(Guid requestId)
        {
            return await _context.JoinGroupRequests.SingleOrDefaultAsync(j => j.Id == requestId);
        }

        public async Task<JoinGroupRequest?> GetJoinGroupRequestByUserIdAndGroupIdAsync(string userId, Guid groupId)
        {
            return await _context.JoinGroupRequests.SingleOrDefaultAsync(j => j.UserId == userId && j.GroupId == groupId);
        }

        public async Task<(List<JoinGroupRequest> Requests, int TotalCount)> GetPendingJoinGroupRequestedAsync(Guid groupId, int page, int size)
        {
            var query = _context.JoinGroupRequests
                .Where(j => j.GroupId == groupId && !j.Status).AsQueryable();

            var totalCount = await query.CountAsync();  

            var requests = await query
                .Skip((page - 1) * size)
                .Take(size)
                .Include(j => j.User)
                .ToListAsync();

            return (requests, totalCount);
        }

        public void RemoveJoinGroupRequest(JoinGroupRequest request)
        {
            _context.JoinGroupRequests.Remove(request);
        }
    }
}
