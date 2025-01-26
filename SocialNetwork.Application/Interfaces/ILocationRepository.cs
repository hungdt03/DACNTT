

using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface ILocationRepository 
    {
        Task CreateLocationAsync(Location location);
        Task<Location?> GetLocationByIdAsync(Guid locationId);
        Task<Location?> GetLocationByNameAsync(string name);
        Task<ICollection<Location>> GetLocationsContainsName(string name);  
    }
}
