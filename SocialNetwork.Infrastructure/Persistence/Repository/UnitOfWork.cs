
using Microsoft.EntityFrameworkCore.Storage;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Infrastructure.DBContext;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction _currentTransaction;

        public IUserRepository UserRepository { get; }
        public IPostRepository PostRepository { get; }

        public ICommentRepository CommentRepository {  get; }

        public IReactionRepository ReactionRepository { get; }

        public IPostMediaRepository PostMediaRepository { get; }

        public UnitOfWork
        (
                AppDbContext context, 
                IUserRepository userRepository, 
                IPostRepository postRepository, 
                ICommentRepository commentRepository,
                IReactionRepository reactionRepository,
                IPostMediaRepository postMediaRepository
        )
        {
            _context = context;
            UserRepository = userRepository;
            PostRepository = postRepository;
            CommentRepository = commentRepository;
            ReactionRepository = reactionRepository;
            PostMediaRepository = postMediaRepository;
        }

        public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            _currentTransaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_currentTransaction == null)
            {
                throw new InvalidOperationException("Transaction has not been started.");
            }

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
                await _currentTransaction.CommitAsync(cancellationToken);
            }
            catch
            {
                await RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }

        public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
        {
            if (_currentTransaction == null)
            {
                throw new InvalidOperationException("Transaction has not been started.");
            } else
            {
                await _currentTransaction.RollbackAsync(cancellationToken);
            }
        }

        public void Dispose()
        {
            if (_currentTransaction != null)
            {
                _currentTransaction.Dispose();
            }
            _context.Dispose();
        }
    }
}
