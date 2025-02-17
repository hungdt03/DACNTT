

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class EditPostHandler : IRequestHandler<EditPostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public EditPostHandler(IUnitOfWork unitOfWork, ICloudinaryService cloudinaryService, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _cloudinaryService = cloudinaryService;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(EditPostCommand request, CancellationToken cancellationToken)
        {

            if (request.Post.Images != null || request.Post.Videos != null)
            {
                var totalFiles = request.Post.Images != null && request.Post.Videos != null
                    ? request.Post.Images.Concat(request.Post.Videos).ToList()
                    : request.Post.Images ?? request.Post.Videos?.ToList();

                long maxSizeInBytes = 50 * 1024 * 1024;
                if (FileValidationHelper.AreFilesTooLarge(totalFiles, maxSizeInBytes))
                {
                    throw new AppException("Tổng kích thước các tệp vượt quá giới hạn 50MB.");
                }
            }

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Không tìm thấy bài viết");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (request.Post.RemoveMediaIds != null &&  request.Post.RemoveMediaIds.Count > 0)
            {
                foreach(var item in post.Medias)
                {
                    if(request.Post.RemoveMediaIds.Contains(item.Id))
                    {
                        var media = await _unitOfWork.PostMediaRepository.GetPostMediaByIdAsync(item.Id);
                        if (media == null) continue;

                        _unitOfWork.PostMediaRepository.DeletePostMedia(media);
                    }
                }
            }

            if (request.Post.RemoveTagIds != null && request.Post.RemoveTagIds.Count > 0)
            {
                foreach (var item in post.Tags)
                {
                    if (request.Post.RemoveTagIds.Contains(item.Id))
                    {
                        var tag = await _unitOfWork.TagRepository.GetTagByIdAsync(item.Id);
                        if (tag == null) continue;

                        _unitOfWork.TagRepository.DeleteTag(tag);
                    }
                }
            }

            var medias = new List<PostMedia>();

            if (request.Post.Images != null && request.Post.Images.Count > 0)
            {
                var images = await _cloudinaryService.UploadMultipleImagesAsync(request.Post.Images);
                medias.AddRange(images.Select(image => new PostMedia
                {
                    MediaType = MediaType.IMAGE,
                    MediaUrl = image
                }));
            }

            if (request.Post.Videos != null && request.Post.Videos.Count > 0)
            {
                var videos = await _cloudinaryService.UploadMultipleVideosAsync(request.Post.Videos);
                medias.AddRange(videos.Select(video => new PostMedia
                {
                    MediaType = MediaType.VIDEO,
                    MediaUrl = video
                }));
            }

            var notifications = new List<Domain.Entity.System.Notification>();
            var tags = new List<Tag>();
            if (request.Post.TagIds != null && request.Post.TagIds.Count > 0)
            {
                foreach (var tag in request.Post.TagIds)
                {
                    if (post.Tags.Any(t => t.UserId == tag)) continue;
                    var tagUser = await _unitOfWork.UserRepository.GetUserByIdAsync(tag)
                        ?? throw new NotFoundException("Không tìm thấy thẻ user");

                    tags.Add(new Tag()
                    {
                        UserId = tagUser.Id,
                    });

                    var notification = new Domain.Entity.System.Notification
                    {
                        PostId = post.Id,
                        Content = $"{post.User.FullName} đã gắn thẻ bạn trong một bài viết",
                        DateSent = DateTimeOffset.UtcNow,
                        ImageUrl = post.User.Avatar,
                        IsRead = false,
                        Title = "Gắn thẻ bài viết",
                        Type = NotificationType.ASSIGN_POST_TAG,
                        RecipientId = tagUser.Id,
                        Recipient = tagUser
                    };

                    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
                    notifications.Add(notification);
                }

            }

            post.Content = request.Post.Content;
            post.Privacy = request.Post.Privacy;
            post.Medias = (post.Medias ?? new List<PostMedia>()).Concat(medias).ToList();
            post.Tags = (post.Tags ?? new List<Tag>()).Concat(tags).ToList();
            post.Background = request.Post.Background;

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            foreach (var noti in notifications)
            {
                await _signalRService.SendNotificationToSpecificUser(noti.Recipient.UserName, ApplicationMapper.MapToNotification(noti));
            }

            return new BaseResponse
            {
                IsSuccess = true,
                Message = "Cập nhật bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
