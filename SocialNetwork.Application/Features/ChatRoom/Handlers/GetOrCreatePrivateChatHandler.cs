
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.ChatRoom.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Application.Utils;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.ChatRoomInfo;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class GetOrCreatePrivateChatHandler : IRequestHandler<GetOrCreatePrivateChatCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IUserStatusService _userStatusService;
        private readonly ISignalRService _signalRService;

        public GetOrCreatePrivateChatHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager, IUserStatusService userStatusService, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _userStatusService = userStatusService;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(GetOrCreatePrivateChatCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var receiver = await _userManager.FindByIdAsync(request.ReceiverId)
                ?? throw new NotFoundException("ID đối phương không tồn tại");

            var memberIds = new List<string>() { userId, receiver.Id };
            var chatRoom = await _unitOfWork.ChatRoomRepository
                .GetPrivateChatRoomByMemberIds(memberIds);
           
            if(chatRoom == null)
            {
                chatRoom = new Domain.Entity.ChatRoomInfo.ChatRoom();
                chatRoom.IsPrivate = true;
                chatRoom.UniqueName = ChatUtils.GenerateChatRoomName(memberIds);
                chatRoom.Name = "Private chat";
                chatRoom.ImageUrl = "NONE";
                chatRoom.LastMessageDate = DateTimeOffset.UtcNow;

                var me = new ChatRoomMember()
                {
                    UserId = userId,
                    IsAccepted = false,
                };

                var user = new ChatRoomMember()
                {
                    UserId = receiver.Id,
                    User = receiver,
                    IsAccepted = false,
                };

                var friendShip = await _unitOfWork.FriendShipRepository
                   .GetFriendShipByUserIdAndFriendIdAsync(userId, receiver.Id, FriendShipStatus.ACCEPTED);

                if (friendShip != null)
                {
                    user.IsAccepted = true;
                    me.IsAccepted = true;
                }


                var members = new List<ChatRoomMember>
                {
                    me, user
                };
               
                chatRoom.Members = members;

                await _unitOfWork.BeginTransactionAsync();
                await _unitOfWork.ChatRoomRepository.CreateChatRoom(chatRoom);
                await _unitOfWork.CommitTransactionAsync();

                await _signalRService.JoinGroup(userId, chatRoom.UniqueName);
                chatRoom = await _unitOfWork.ChatRoomRepository.GetChatRoomByIdAsync(chatRoom.Id);
            } 

            var response = ApplicationMapper.MapToChatRoom(chatRoom);

            var recipient = chatRoom.Members.FirstOrDefault(s => s.UserId != userId);
            if (recipient == null) throw new AppException("Có lỗi xảy ra, vui lòng thử lại");

            response.Friend = ApplicationMapper.MapToUser(receiver);
            if (recipient.IsAccepted)
            {
                response.IsOnline = receiver.IsOnline;
                var haveStory = await _unitOfWork.StoryRepository
                       .IsUserHaveStoryAsync(receiver.Id);

                response.Friend.HaveStory = haveStory;
            }
           
            response.IsAccept = chatRoom.Members.FirstOrDefault(s => s.UserId == userId)?.IsAccepted ?? false;
            response.IsRecipientAccepted = recipient.IsAccepted;
            response.RecentOnlineTime = receiver.RecentOnlineTime;

            return new DataResponse<ChatRoomResponse>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin cuộc hội thoại thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
