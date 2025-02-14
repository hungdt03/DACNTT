
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IBlockListRepository
    {
        Task CreateNewBlockAsync(BlockList block);
        Task<(List<BlockList> BlockLists, int TotalCount)> GetAllBlocksByUserIdAsync(string userId, int page, int size);
        Task<BlockList?> GetBlockListByIdAsync(Guid id);
        Task<BlockList?> GetBlockListByUserIdAndUserIdAsync(string blockeeId, string blockerId);
        Task<BlockList?> GetBlockListByBlockeeIdAndBlockerIdAsync(string blockeeId, string blockerId);
        Task<bool> CheckIsBlockAsync(string blockeeId, string blockerId);
        void RemoveBlockList(BlockList blockList);
    }
}
