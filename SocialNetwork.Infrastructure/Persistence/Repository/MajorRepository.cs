

using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class MajorRepository : IMajorRepository
    {
        private readonly AppDbContext _context;

        public MajorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateNewMajorAsync(Major major)
        {
            await _context.Majors.AddAsync(major);
        }

        public async Task<Major?> GetMajorByIdAsync(Guid majorId)
        {
            return await _context.Majors.SingleOrDefaultAsync(m => m.Id == majorId);
        }

        public async Task<Major?> GetMajorByNameAsync(string name)
        {
            return await _context.Majors.SingleOrDefaultAsync(m => m.Name == name);
        }

        public async Task<ICollection<Major>> GetMajorsContainsName(string name)
        {
            return await _context.Majors.Where(m => m.Name.ToLower().Contains(name.ToLower())).ToListAsync();
        }
    }
}
