

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
    public class ReactToStoryHandler : IRequestHandler<ReactToStoryCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ReactToStoryHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ReactToStoryCommand request, CancellationToken cancellationToken)
        {
            var story = await _unitOfWork.StoryRepository.GetStoryByIdAsync(request.StoryId)
                ?? throw new NotFoundException("Tin không tồn tại");

            if (story.ExpiresAt < DateTimeOffset.UtcNow)
                throw new AppException("Tin không còn nữa");

            if (!ReactionType.IsValidReactionType(request.ReactionType))
                throw new AppException("Cảm xúc không hợp lệ");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            if (userId == story.UserId) throw new AppException("Không thể cảm xúc story của chính mình");

            var reactViewer = new Domain.Entity.StoryInfo.Viewer()
            {
                Reaction = request.ReactionType,
                StoryId = request.StoryId,
                UserId = userId
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.ViewerRepository.CreateViewerAsync(reactViewer);

            var fullName = _contextAccessor.HttpContext.User.GetFullName();
            var avatar = _contextAccessor.HttpContext.User.GetAvatar();

            var notification = new Domain.Entity.System.Notification();
            notification.StoryId = request.StoryId;
            notification.RecipientId = story.UserId;
            notification.DateSent = DateTimeOffset.UtcNow;
            notification.Title = "Xem tin";
            notification.Content = $"{fullName} đã bày tỏ cảm xúc về tin của bạn";
            notification.ImageUrl = avatar;
            notification.IsRead = false;
            notification.Type = NotificationType.REACT_STORY;

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var mapNoti = ApplicationMapper.MapToNotification(notification);
            await _signalRService.SendNotificationToSpecificUser(story.User.UserName, mapNoti);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bày tỏ cảm xúc về tin thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };

        }
    }
}
