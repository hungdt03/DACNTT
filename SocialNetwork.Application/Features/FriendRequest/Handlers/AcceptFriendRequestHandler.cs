using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.FriendRequest.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;
using System.Net;

namespace SocialNetwork.Application.Features.FriendRequest.Handlers
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
            var friendRequest = await _unitOfWork.FriendRequestRepository.GetFriendRequestByIdAsync(request.RequestId)
                ?? throw new AppException("Lời mời kết bạn không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            if (friendRequest.Status != FriendRequestStatus.PENDING || friendRequest.SenderId == userId)
                throw new AppException("Yêu cầu không hợp lệ");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            friendRequest.Status = FriendRequestStatus.ACCEPTED;

            var newFriend = new Domain.Entity.Friend()
            {
                ConnectedAt = DateTime.UtcNow,
                FirstUserId = friendRequest.SenderId,
                LastUserId = friendRequest.ReceiverId,
            };

            await _unitOfWork.FriendRepository.CreateFriendAsync(newFriend);

            var notification = new Domain.Entity.Notification()
            {
                Content = $"{friendRequest.Receiver.FullName} đã chấp nhận lời mời kết bạn của bạn",
                ImageUrl = friendRequest.Receiver.Avatar,
                RecipientId = friendRequest.SenderId,
                DateSent = DateTimeOffset.UtcNow,
                Title = "Lời mời kết bạn",
                Type = NotificationType.FRIEND_REQUEST_ACCEPTED,
                FriendRequestId = friendRequest.Id,
                IsRead = false
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            _signalRService.SendNotificationToSpecificUser(friendRequest.Sender.UserName, ApplicationMapper.MapToNotification(notification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Chấp nhận kết bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
