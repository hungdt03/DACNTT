
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;
using static System.Net.Mime.MediaTypeNames;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class CreatePostHandler : IRequestHandler<CreatePostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICloudinaryService cloudinaryService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public CreatePostHandler(IUnitOfWork unitOfWork, ICloudinaryService cloudinaryService, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            this.cloudinaryService = cloudinaryService;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(CreatePostCommand request, CancellationToken cancellationToken)
        {
            var medias = new List<PostMedia>();

            if (request.Images?.Any() == true)
            {
                var images = await cloudinaryService.UploadMultipleImagesAsync(request.Images);
                medias.AddRange(images.Select(image => new PostMedia
                {
                    MediaType = MediaType.IMAGE,
                    MediaUrl = image
                }));
            }

            if (request.Videos?.Any() == true)
            {
                var videos = await cloudinaryService.UploadMultipleVideosAsync(request.Videos);
                medias.AddRange(videos.Select(video => new PostMedia
                {
                    MediaType = MediaType.VIDEO,
                    MediaUrl = video
                }));
            }

            var tags = new List<Domain.Entity.Tag>();
            if (request.TagIds != null && request.TagIds.Count > 0)
            {
                foreach(var tag in request.TagIds)
                {
                    if (tags.Any(t => t.UserId == tag)) continue;
                    var tagUser = await _unitOfWork.UserRepository.GetUserByIdAsync(tag)
                        ?? throw new NotFoundException("Không tìm thấy thẻ user");

                    tags.Add(new Tag()
                    {
                        UserId = tagUser.Id,
                        User = tagUser,
                    });
                }
                
            }

            var post = new SocialNetwork.Domain.Entity.Post
            {
                Content = request.Content,
                Medias = medias,
                PostType = PostType.ORIGINAL_POST,
                Privacy = request.Privacy,
                UserId = _contextAccessor.HttpContext.User.GetUserId(),
                Tags = tags
            };

          

            var fullName = _contextAccessor.HttpContext.User.GetFullName();
            var imageUrl = _contextAccessor.HttpContext.User.GetAvatar();
            string contentNotification = $"{fullName} đã gắn thẻ bạn trong một bài viết";

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.PostRepository.CreatePostAsync(post);

            var notifications = tags.Select(tag => new Domain.Entity.Notification
            {
                PostId = post.Id,
                Content = $"{fullName} đã gắn thẻ bạn trong một bài viết",
                DateSent = DateTimeOffset.UtcNow,
                ImageUrl = imageUrl,
                IsRead = false,
                Title = "Gắn thẻ bài viết",
                Type = NotificationType.ASSIGN_POST_TAG,
                RecipientId = tag.UserId,
                Recipient = tag.User
            }).ToList();

            foreach (var notification in notifications)
            {
                await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            foreach(var noti in notifications)
            {
                _signalRService.SendNotificationToSpecificUser(noti.Recipient.UserName, ApplicationMapper.MapToNotification(noti));
            }

            return new DataResponse<PostResponse>
            {
                IsSuccess = true,
                Message = "Tạo bài viết mới thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Data = ApplicationMapper.MapToPost(post)
            };
        }
    }
}
