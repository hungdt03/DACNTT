
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class CompanyRepostiory : ICompanyRepository
    {
        private readonly AppDbContext _context;

        public CompanyRepostiory(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateCompanyAsync(Company company)
        {
            await _context.Companies.AddAsync(company);
        }

        public Task<IEnumerable<Company>> GetAllCompaniesAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Company>> GetCompaniesContainsNameAsync(string name)
        {
            return await _context.Companies.Where(c => c.Name.ToLower().Contains(name.ToLower())).ToListAsync();
        }

        public async Task<Company?> GetCompanyByIdAsync(Guid companyId)
        {
            return await _context.Companies.SingleOrDefaultAsync(c => c.Id == companyId);
        }

        public async Task<Company?> GetCompanyByNameAsync(string name)
        {
            return await _context.Companies.SingleOrDefaultAsync(c => c.Name == name);
        }
    }
}
