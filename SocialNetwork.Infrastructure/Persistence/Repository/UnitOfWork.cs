
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
        public ISchoolRepository SchoolRepository { get; }
        public IUserSchoolRepository UserSchoolRepository { get; }
        public IProfessionRepository ProfessionRepository { get; }
        public IMajorRepository MajorRepository { get; }
        public ICompanyRepository CompanyRepository { get; }
        public IPositionRepository PositionRepository { get; }
        public IUserWorkPlaceRepository UserWorkPlaceRepository { get; }
        public ILocationRepository LocationRepository { get; }
        public IGroupRepository GroupRepository { get; }
        public IGroupMemberRepository GroupMemberRepository { get; }
        public IGroupInvitationRepository GroupInvitationRepository {  get; }
        public IJoinGroupRequestRepository JoinGroupRequestRepository {  get; }
        public IGroupRoleInvitationRepository GroupRoleInvitationRepository {  get; }

        public UnitOfWork
        (
                AppDbContext context, 
                IUserRepository userRepository, 
                IPostRepository postRepository, 
                ICommentRepository commentRepository,
                IReactionRepository reactionRepository,
                IPostMediaRepository postMediaRepository,
                IFriendShipRepository friendShipRepository,
                INotificationRepository notificationRepository,
                ITagRepository tagRepository,
                IChatRoomRepository chatRoomRepository,
                IChatRoomMemberRepository chatRoomMemberRepository,
                IMessageRepository messageRepository,
                IStoryRepository storyRepository,
                IMessageReadStatusRepository messageReadStatusRepository,
                IViewerRepository viewerRepository,
                IFollowRepository followRepository,
                IMessageMediaRepository messageMediaRepository,
                IOTPRepository oTPRepository,
                ISchoolRepository schoolRepository,
                IUserSchoolRepository userSchoolRepository,
                IProfessionRepository professionRepository,
                IMajorRepository majorRepository,
                ICompanyRepository companyRepository,
                IPositionRepository positionRepository,
                IUserWorkPlaceRepository userWorkPlaceRepository,
                ILocationRepository locationRepository,
                IGroupRepository groupRepository,
                IGroupMemberRepository groupMemberRepository,
                IGroupInvitationRepository groupInvitationRepository,
                IJoinGroupRequestRepository joinGroupRequestRepository,
                IGroupRoleInvitationRepository groupRoleInvitationRepository
        )
        {
            _context = context;
            UserRepository = userRepository;
            PostRepository = postRepository;
            CommentRepository = commentRepository;
            ReactionRepository = reactionRepository;
            PostMediaRepository = postMediaRepository;
            FriendShipRepository = friendShipRepository;
            NotificationRepository = notificationRepository;
            TagRepository = tagRepository;
            ChatRoomRepository = chatRoomRepository;
            ChatRoomMemberRepository = chatRoomMemberRepository;
            MessageRepository = messageRepository;
            StoryRepository = storyRepository;
            MessageReadStatusRepository = messageReadStatusRepository;
            ViewerRepository = viewerRepository;
            FollowRepository = followRepository;
            MessageMediaRepository = messageMediaRepository;
            OTPRepository = oTPRepository;
            SchoolRepository = schoolRepository;
            UserSchoolRepository = userSchoolRepository;    
            ProfessionRepository = professionRepository;
            MajorRepository = majorRepository;
            LocationRepository = locationRepository;
            UserWorkPlaceRepository = userWorkPlaceRepository;
            PositionRepository = positionRepository;
            CompanyRepository = companyRepository;
            UserWorkPlaceRepository = userWorkPlaceRepository;
            GroupRepository = groupRepository;
            GroupMemberRepository = groupMemberRepository;
            GroupInvitationRepository = groupInvitationRepository;
            JoinGroupRequestRepository = joinGroupRequestRepository;
            GroupRoleInvitationRepository = groupRoleInvitationRepository;
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
