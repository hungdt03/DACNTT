

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.FriendShip.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using System.Net;

namespace SocialNetwork.Application.Features.FriendShip.Handlers
{
    public class CreateFriendRequestHandler : IRequestHandler<CreateFriendRequestCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly ISignalRService _signalRService;

        public CreateFriendRequestHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager, ISignalRService signalRService)
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

            var existedRequest = await _unitOfWork.FriendShipRepository
                .GetFriendShipByUserIdAndFriendIdAsync(userId, request.ReceiverId);

            if (existedRequest != null && existedRequest.Status != FriendShipStatus.NONE) throw new AppException("Đã tồn tại lời mời kết bạn hoặc đã là bạn bè");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (existedRequest == null)
            {
                existedRequest = new Domain.Entity.UserInfo.FriendShip()
                {
                    FriendId = request.ReceiverId,
                    UserId = userId,
                    Status = FriendShipStatus.PENDING,
                };

                await _unitOfWork.FriendShipRepository.CreateFriendShipAsync(existedRequest);

            } else
            {
                existedRequest.Status = FriendShipStatus.PENDING;
            }

            var notification = new Domain.Entity.System.Notification()
            {
                Content = $"{user.FullName} đã gửi cho bạn lời mời kết bạn",
                ImageUrl = user.Avatar,
                RecipientId = request.ReceiverId,
                DateSent = DateTimeOffset.UtcNow,
                Title = "Lời mời kết bạn",
                Type = NotificationType.FRIEND_REQUEST_SENT,
                FriendRequestId = existedRequest.Id,
                IsRead = false,
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendNotificationToSpecificUser(receiver.UserName, ApplicationMapper.MapToNotification(notification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Đã gửi lời mời kết bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
