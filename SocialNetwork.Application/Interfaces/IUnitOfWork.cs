
namespace SocialNetwork.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        public IUserRepository UserRepository { get; }
        public IPostRepository PostRepository { get; }
        public ICommentRepository CommentRepository { get; }

        Task BeginTransactionAsync(CancellationToken cancellationToken = default);
        Task CommitTransactionAsync(CancellationToken cancellationToken = default);
        Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    }
}
