
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.UserInfo;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class BlockListRepository : IBlockListRepository
    {
        private readonly AppDbContext _context;

        public BlockListRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckIsBlockAsync(string blockeeId, string blockerId)
        {
            return await _context.BlockLists
                .AnyAsync(b => (b.BlockerId == blockerId && b.BlockeeId == blockeeId) || (b.BlockerId == blockeeId && b.BlockeeId == blockerId));
        }

        public async Task CreateNewBlockAsync(BlockList block)
        {
            await _context.BlockLists.AddAsync(block);
        }

        public async Task<(List<BlockList> BlockLists, int TotalCount)> GetAllBlocksByUserIdAsync(string userId, int page, int size)
        {
            var queryable = _context.BlockLists
                .Include(b => b.Blockee)
                .Where(b => b.BlockerId == userId).AsQueryable();

            var totalCount = await queryable.CountAsync();
            
            var blockLists = await queryable
                .OrderByDescending(b => b.DateCreated)
                .Skip((page - 1) * size)    
                .Take(size)
                .ToListAsync();

            return (blockLists, totalCount);    
        }

        public async Task<BlockList?> GetBlockListByBlockeeIdAndBlockerIdAsync(string blockeeId, string blockerId)
        {
            return await _context.BlockLists
                .SingleOrDefaultAsync(b => b.BlockerId == blockerId && b.BlockeeId == blockeeId);
        }

        public async Task<BlockList?> GetBlockListByUserIdAndUserIdAsync(string blockeeId, string blockerId)
        {
            return await _context.BlockLists
                .SingleOrDefaultAsync(b => (b.BlockerId == blockerId && b.BlockeeId == blockeeId) || (b.BlockerId == blockeeId && b.BlockeeId == blockerId));
        }

        public async Task<BlockList?> GetBlockListByIdAsync(Guid id)
        {
            return await _context.BlockLists.SingleOrDefaultAsync(b => b.Id == id);
        }

        public void RemoveBlockList(BlockList blockList)
        {
            _context.BlockLists.Remove(blockList);
        }
    }
}
