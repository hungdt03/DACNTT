using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class ProfessionRepository : IProfessionRepository
    {
        private readonly AppDbContext _context;

        public ProfessionRepository(AppDbContext context) { 
            _context = context;
        }
        public async Task CreateNewProfessionAsync(Profession profession)
        {
            await _context.Professions.AddAsync(profession);
        }
    }
}
