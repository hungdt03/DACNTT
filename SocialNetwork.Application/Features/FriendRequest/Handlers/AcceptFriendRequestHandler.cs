using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.FriendShip.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Application.Utils;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.ChatRoomInfo;

namespace SocialNetwork.Application.Features.FriendShip.Handlers
{
    public class AcceptFriendRequestHandler : IRequestHandler<AcceptFriendRequestCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;

        public AcceptFriendRequestHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork, ISignalRService signalRService)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(AcceptFriendRequestCommand request, CancellationToken cancellationToken)
        {
            var friendRequest = await _unitOfWork.FriendShipRepository.GetFriendShipByIdAsync(request.RequestId)
                ?? throw new AppException("Lời mời kết bạn không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            if (friendRequest.Status != FriendShipStatus.PENDING || friendRequest.UserId == userId)
                throw new AppException("Yêu cầu không hợp lệ");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            friendRequest.Status = FriendShipStatus.ACCEPTED;
            friendRequest.IsConnect = true;

            var memberIds = new List<string>
            {
                friendRequest.FriendId,
                friendRequest.UserId
            };

            var chatRoom = await _unitOfWork.ChatRoomRepository.GetPrivateChatRoomByMemberIds(memberIds);

            if(chatRoom == null)
            {
                var chatRoomName = ChatUtils.GenerateChatRoomName(memberIds);
                var firstMember = new ChatRoomMember()
                {
                    UserId = friendRequest.FriendId,
                };

                var secondMember = new ChatRoomMember()
                {
                    UserId = friendRequest.UserId,
                };

                var members = new List<ChatRoomMember>() { firstMember, secondMember };

                chatRoom = new Domain.Entity.ChatRoomInfo.ChatRoom()
                {
                    IsPrivate = true,
                    LastMessageDate = DateTimeOffset.UtcNow,
                    UniqueName = chatRoomName,
                    Name = chatRoomName,
                    LastMessage = "Các bạn hiện đã được kết nối với nhau",
                    Members = members
                };

                await _unitOfWork.ChatRoomRepository.CreateChatRoom(chatRoom);

                var message = new Domain.Entity.MessageInfo.Message()
                {
                    MessageType = MessageType.SYSTEM,
                    ChatRoomId = chatRoom.Id,
                    Content = "Các bạn hiện đã được kết nối với nhau",
                    SentAt = DateTimeOffset.UtcNow,
                };

                await _unitOfWork.MessageRepository.CreateMessageAsync(message);
            }

            var notification = new Domain.Entity.System.Notification()
            {
                Content = $"{friendRequest.Friend.FullName} đã chấp nhận lời mời kết bạn của bạn",
                ImageUrl = friendRequest.Friend.Avatar,
                RecipientId = friendRequest.UserId,
                DateSent = DateTimeOffset.UtcNow,
                Title = "Lời mời kết bạn",
                Type = NotificationType.FRIEND_REQUEST_ACCEPTED,
                FriendRequestId = friendRequest.Id,
                IsRead = false
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendNotificationToSpecificUser(friendRequest.User.UserName, ApplicationMapper.MapToNotification(notification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Chấp nhận kết bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
