
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface ICompanyRepository
    {
        Task CreateCompanyAsync(Company company);
        Task<IEnumerable<Company>> GetAllCompaniesAsync();
        Task<IEnumerable<Company>> GetCompaniesContainsNameAsync(string name);
        Task<Company?> GetCompanyByNameAsync(string name);
        Task<Company?> GetCompanyByIdAsync(Guid companyId);
    }
}
