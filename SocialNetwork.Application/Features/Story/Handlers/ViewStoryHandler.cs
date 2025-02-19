

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Story.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class ViewStoryHandler : IRequestHandler<ViewStoryCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ViewStoryHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ViewStoryCommand request, CancellationToken cancellationToken)
        {
            var story = await _unitOfWork.StoryRepository.GetStoryByIdAsync(request.StoryId);

            if(story == null || story.Privacy == PrivacyConstant.PRIVATE)
            {
                throw new NotFoundException("Không tìm thấy tin");
            }

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            if (userId == story.UserId)
                throw new AppException("Không thể xem story của chính mình");

            var blockUser = await _unitOfWork.BlockListRepository
              .GetBlockListByUserIdAndUserIdAsync(userId, story.UserId);

            if(blockUser != null) throw new AppException("Bạn không thể xem tin này");

            var friendShip = await _unitOfWork.FriendShipRepository
                .GetFriendShipByUserIdAndFriendIdAsync(userId, story.UserId);

            if ((friendShip == null || !friendShip.IsConnect) && story.Privacy != PrivacyConstant.PUBLIC)
                throw new AppException("Bạn không thể xem tin này");

            if (story.ExpiresAt < DateTimeOffset.UtcNow)
                throw new AppException("Tin không còn nữa");

            if ((friendShip == null || !friendShip.IsConnect) && story.Privacy == PrivacyConstant.PUBLIC)
            {
                return new BaseResponse()
                {
                    IsSuccess = true,
                    Message = "Xem tin thành công",
                    StatusCode = System.Net.HttpStatusCode.OK,
                };
            }

            var isExistedViewer = await _unitOfWork.ViewerRepository.IsViewerExisted(userId, request.StoryId);

            if (isExistedViewer) throw new AppException("Tin này đã được xem trước đó");
           
            var totalViewers = await _unitOfWork
                .ViewerRepository.CountViewersByStoryId(story.Id, userId);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            var viewer = new Domain.Entity.StoryInfo.Viewer()
            {
                StoryId = request.StoryId,
                UserId = userId,
            };

            await _unitOfWork.ViewerRepository.CreateViewerAsync(viewer);

            var userFullName = _contextAccessor.HttpContext.User.GetFullName();
            var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();

            var content = $"{userFullName} và {totalViewers} người khác đã xem tin của bạn";

            if(totalViewers == 0)
            {
                content = $"{userFullName} đã xem tin của bạn";
            }

            var notification = new Domain.Entity.System.Notification()
            {
                Title = "Xem tin",
                Content = content,
                StoryId = story.Id,
                Type = NotificationType.VIEW_STORY,
                ImageUrl = userAvatar,
                IsRead = false,
                DateSent = DateTimeOffset.UtcNow,
                RecipientId = story.User.Id,
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendNotificationToSpecificUser(story.User.UserName, ApplicationMapper.MapToNotification(notification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xem tin thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
