

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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

namespace SocialNetwork.Application.Features.FriendRequest.Handlers
{
    public class CreateFriendRequestHandler : IRequestHandler<CreateFriendRequestCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.User> _userManager;
        private readonly ISignalRService _signalRService;

        public CreateFriendRequestHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.User> userManager, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(CreateFriendRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId);
            var receiver = await _userManager.FindByIdAsync(request.ReceiverId)
                ?? throw new AppException("Thông tin người nhận không tồn tại");

            var existedRequest = await _unitOfWork.FriendRequestRepository
                .GetFriendRequestBySenderIdAndReceiverIdAsync(userId, request.ReceiverId);

            if (existedRequest != null) throw new AppException("Đã tồn tại lời mời kết bạn giữa hai người này");

            var newRequest = new Domain.Entity.FriendRequest()
            {
                ReceiverId = request.ReceiverId,
                SenderId = userId,
                Status = FriendRequestStatus.PENDING,
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.FriendRequestRepository.CreateFriendRequestAsync(newRequest);
           

            var notification = new Domain.Entity.Notification()
            {
                Content = $"{user.FullName} đã gửi cho bạn lời mời kết bạn",
                ImageUrl = user.Avatar,
                RecipientId = request.ReceiverId,
                DateSent = DateTimeOffset.UtcNow,
                Title = "Lời mời kết bạn",
                Type = NotificationType.FRIEND_REQUEST_SENT,
                FriendRequestId = newRequest.Id,
                IsRead = false,
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            _signalRService.SendNotificationToSpecificUser(receiver.UserName, ApplicationMapper.MapToNotification(notification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Đã gửi lời mời kết bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
