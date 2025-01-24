
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Comment.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class CreateCommentHandler : IRequestHandler<CreateCommentCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> userManager;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly ISignalRService _signalRService;

        public CreateCommentHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager, ICloudinaryService cloudinaryService, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            this.userManager = userManager;
            _cloudinaryService = cloudinaryService;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Bài viết không tồn tại");

            var currentUser = await userManager.FindByIdAsync(userId);

            var comment = new Domain.Entity.PostInfo.Comment()
            {
                Content = request.Content,
                UserId = currentUser.Id,
                PostId = request.PostId,
                SentAt = request.SentAt,
            };

            if(request.File != null)
            {
                if (FileValidationHelper.IsImageFile(request.File))
                {
                    var url = await _cloudinaryService.UploadImageAsync(request.File);
                    comment.MediaType = MediaType.IMAGE;
                    comment.MediaUrl = url;
                }
                else if (FileValidationHelper.IsVideoFile(request.File))
                {
                    var url = await _cloudinaryService.UploadVideoAsync(request.File);
                    comment.MediaType = MediaType.VIDEO;
                    comment.MediaUrl = url;
                }
                else throw new AppException("Tập tin không được hỗ trợ");
            }

            Domain.Entity.System.User replyUser = null;
            if (request.ReplyToUserId != userId && !string.IsNullOrEmpty(request.ReplyToUserId))
            {
                replyUser = await userManager.FindByIdAsync(request.ReplyToUserId)
                    ?? throw new AppException("Thông tin người phản hồi không tồn tại");

                comment.ReplyToUserId = request.ReplyToUserId;
                comment.ReplyToUserName = replyUser.FullName;

            }

            if (request.ParentCommentId != null && request.ParentCommentId != Guid.Empty)
            {
                var parentComment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(request.ParentCommentId.Value)
                    ?? throw new AppException("Parent comment không tồn tại");

                int parentCommentLevel = await GetCommentLevelAsync(request.ParentCommentId.Value);

                if (parentCommentLevel >= 3)
                {
                    if (parentComment.ParentCommentId.HasValue)
                    {
                        var grandParentComment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(parentComment.ParentCommentId.Value)
                            ?? throw new AppException("Grandparent comment không tồn tại");

                        comment.ParentCommentId = parentComment.ParentCommentId;
                    }
                    else
                    {
                        throw new AppException("Không thể tạo comment con của comment đã ở cấp độ cao nhất");
                    }
                }
                else
                {
                    comment.ParentCommentId = request.ParentCommentId;
                }
            }

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            var savedComment = await _unitOfWork.CommentRepository.CreateCommentAsync(comment);

            
            var notifications = new List<Domain.Entity.System.Notification>();
            if(request.MentionUserIds != null && request.MentionUserIds.Count > 0)
            {
                var distinctUserIds = request.MentionUserIds.Distinct().ToList();

                foreach (var username in distinctUserIds)
                {
                    if (username == request.ReplyToUserName) continue;

                    var user = await userManager.FindByIdAsync(username);

                    if (user == null)
                        continue;

                    var notification = new Domain.Entity.System.Notification();
                    notification.CommentId = savedComment.Id;
                    notification.RecipientId = user.Id;
                    notification.PostId = post.Id;
                    notification.Recipient = user;
                    notification.Title = "Bình luận";
                    notification.Content = $"{currentUser.FullName} đã nhắc tới bạn trong một bình luận";
                    notification.IsRead = false;
                    notification.DateSent = DateTimeOffset.UtcNow;
                    notification.Type = NotificationType.COMMENT_MENTION;
                    notification.ImageUrl = currentUser.Avatar;

                    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);

                    notifications.Add(notification);
                }
            }

            Domain.Entity.System.Notification notiComment = null;
            if (replyUser != null)
            {
                notiComment = new Domain.Entity.System.Notification();
                notiComment.CommentId = savedComment.Id;
                notiComment.RecipientId = replyUser.Id;
                notiComment.Title = "Bình luận";
                notiComment.Content = $"{currentUser.FullName} đã phản hồi bình luận của bạn";
                notiComment.IsRead = false;
                notiComment.PostId = post.Id;
                notiComment.DateSent = DateTimeOffset.UtcNow;
                notiComment.Type = NotificationType.REPLIED_TO_COMMENT;
                notiComment.ImageUrl = currentUser.Avatar;

                await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiComment);
            }
            else if(userId != post.UserId)
            {
                notiComment = new Domain.Entity.System.Notification();
                notiComment.CommentId = savedComment.Id;
                notiComment.RecipientId = post.UserId;
                notiComment.Title = "Bình luận";
                notiComment.Content = $"{currentUser.FullName} đã bình luận bài viết của bạn";
                notiComment.IsRead = false;
                notiComment.PostId = post.Id;
                notiComment.DateSent = DateTimeOffset.UtcNow;
                notiComment.Type = NotificationType.COMMENTED_ON_POST;
                notiComment.ImageUrl = currentUser.Avatar;

                await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiComment);
            }


            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            
            if (replyUser != null)
            {
                var mapNoti = ApplicationMapper.MapToNotification(notiComment);
                await _signalRService.SendNotificationToSpecificUser(replyUser.UserName, mapNoti);
            } else if(userId != post.UserId)
            {
                var mapNoti = ApplicationMapper.MapToNotification(notiComment);
                await _signalRService.SendNotificationToSpecificUser(post.User.UserName, mapNoti);
            }

            foreach (var notification in notifications)
            {
                var mapMentionNoti = ApplicationMapper.MapToNotification(notification);
                await _signalRService.SendNotificationToSpecificUser(notification.Recipient.UserName, mapMentionNoti);
            }

            var response = ApplicationMapper.MapToComment(savedComment);
            return new DataResponse<CommentResponse>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Tải bình luận thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<int> GetCommentLevelAsync(Guid commentId)
        {
            var comment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(commentId);

            if (comment == null)
            {
                throw new AppException("Comment không tồn tại");
            }

            if (comment.ParentCommentId == null)
            {
                return 1;  
            }

            return await GetCommentLevelAsync(comment.ParentCommentId.Value) + 1;
        }

    }
}
