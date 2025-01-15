
namespace SocialNetwork.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        public IUserRepository UserRepository { get; }
        public IPostRepository PostRepository { get; }
        public ICommentRepository CommentRepository { get; }
        public IReactionRepository ReactionRepository { get; }
        public IPostMediaRepository PostMediaRepository { get; }
        public IFriendShipRepository FriendShipRepository { get; }
        public INotificationRepository NotificationRepository { get; }
        public ITagRepository TagRepository { get; }
        public IChatRoomRepository ChatRoomRepository { get; }
        public IChatRoomMemberRepository ChatRoomMemberRepository { get; }
        public IMessageRepository MessageRepository { get; }
        public IStoryRepository StoryRepository { get; }
        public IMessageReadStatusRepository MessageReadStatusRepository { get; }
        public IViewerRepository ViewerRepository { get; }
        public IFollowRepository FollowRepository { get; }
        public IMessageMediaRepository MessageMediaRepository { get; }
        public IOTPRepository OTPRepository { get; }

        Task BeginTransactionAsync(CancellationToken cancellationToken = default);
        Task CommitTransactionAsync(CancellationToken cancellationToken = default);
        Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
    }
}
