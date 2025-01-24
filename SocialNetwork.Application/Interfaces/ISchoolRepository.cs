

using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface ISchoolRepository
    {
        Task CreateSchoolAsync(School school);
        Task<IEnumerable<School>> GetAllSchoolsAsync();
        Task<IEnumerable<School>> GetSchoolsContainsNameAsync(string name);
        Task<School?> GetSchoolByNameAsync(string name);    
    }
}
