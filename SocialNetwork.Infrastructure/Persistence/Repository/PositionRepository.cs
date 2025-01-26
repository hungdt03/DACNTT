
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class PositionRepository : IPositionRepository
    {
        private readonly AppDbContext _context;

        public PositionRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task CreatePositionAsync(Position company)
        {
            await _context.Positions.AddAsync(company);
        }

        public Task<IEnumerable<Position>> GetAllPositionsAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Position>> GetPositionsContainsNameAsync(string name)
        {
            return await _context.Positions.Where(p => p.Name.ToLower().Contains(name.ToLower())).ToListAsync();
        }

        public async Task<Position?> GetPositionByIdAsync(Guid positionId)
        {
            return await _context.Positions.SingleOrDefaultAsync(p => p.Id == positionId);
        }

        public async Task<Position?> GetPositionByNameAsync(string name)
        {
            return await _context.Positions.SingleOrDefaultAsync(p => p.Name == name);
        }
    }
}
