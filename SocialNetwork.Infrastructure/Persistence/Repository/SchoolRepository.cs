

using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class SchoolRepository : ISchoolRepository
    {
        private readonly AppDbContext _context;

        public SchoolRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateSchoolAsync(School school)
        {
            await _context.Schools.AddAsync(school);
        }

        public async Task<IEnumerable<School>> GetAllSchoolsAsync()
        {
            return await _context.Schools.ToListAsync();
        }

        public async Task<School?> GetSchoolByIdAsync(Guid schoolId)
        {
            return await _context.Schools
                .SingleOrDefaultAsync(s => s.Id.Equals(schoolId));
        }

        public async Task<School?> GetSchoolByNameAsync(string name)
        {
            return await _context.Schools
                .SingleOrDefaultAsync(s => s.Name.Equals(name));
        }

        public async Task<IEnumerable<School>> GetSchoolsContainsNameAsync(string name)
        {
            return await _context.Schools
                .Where(sc => sc.Name.ToLower().Contains(name.ToLower()))
                .ToListAsync();
        }
    }
}
