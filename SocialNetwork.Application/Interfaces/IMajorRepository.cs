

using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface IMajorRepository
    {
        Task CreateNewMajorAsync(Major major);
        Task<Major?> GetMajorByIdAsync(Guid majorId);
        Task<Major?> GetMajorByNameAsync(string name);
        Task<ICollection<Major>> GetMajorsContainsName(string name);
    }
}
