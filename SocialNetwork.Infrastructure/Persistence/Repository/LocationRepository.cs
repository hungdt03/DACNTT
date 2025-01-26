using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class LocationRepository : ILocationRepository
    {
        private readonly AppDbContext _context;

        public LocationRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateLocationAsync(Location location)
        {
            await _context.Locations.AddAsync(location);
        }

        public async Task<Location?> GetLocationByIdAsync(Guid locationId)
        {
            return await _context.Locations.SingleOrDefaultAsync(lo => lo.Id == locationId);
        }

        public async Task<Location?> GetLocationByNameAsync(string name)
        {
            return await _context.Locations.SingleOrDefaultAsync(lo => lo.Address == name);
        }

        public async Task<ICollection<Location>> GetLocationsContainsName(string name)
        {
            return await _context.Locations.Where(l => l.Address.ToLower().Contains(name.ToLower())).ToListAsync();
        }
    }
}
