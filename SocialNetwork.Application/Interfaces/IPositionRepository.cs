using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface IPositionRepository
    {
        Task CreatePositionAsync(Position company);
        Task<IEnumerable<Position>> GetAllPositionsAsync();
        Task<IEnumerable<Position>> GetPositionsContainsNameAsync(string name);
        Task<Position?> GetPositionByNameAsync(string name);
        Task<Position?> GetPositionByIdAsync(Guid positionId);
    }
}
