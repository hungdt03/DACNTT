

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
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class CreateSharePostHandler : IRequestHandler<CreateSharePostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public CreateSharePostHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(CreateSharePostCommand request, CancellationToken cancellationToken)
        {
            var originalPost = await _unitOfWork.PostRepository.GetPostByIdAsync(request.OriginalPostId)
                ?? throw new AppException("Không tìm thấy bài viết gốc");

            var post = originalPost;
            if (request.OriginalPostId != request.PostId)
            {
                post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Không tìm thấy bài viết chia sẻ");
            }

            var tags = new List<Tag>();
            if (request.TagIds != null && request.TagIds.Count > 0)
            {
                foreach (var tag in request.TagIds)
                {
                    if (tags.Any(t => t.UserId == tag)) continue;
                    var tagUser = await _unitOfWork.UserRepository.GetUserByIdAsync(tag)
                        ?? throw new NotFoundException("Không tìm thấy thẻ user");

                    tags.Add(new Tag()
                    {
                        UserId = tagUser.Id,
                    });
                }
            }

            var sharePost = new Domain.Entity.PostInfo.Post
            {
                Content = request.Content,
                PostType = PostType.SHARE_POST,
                OriginalPostId = request.OriginalPostId,
                SharePostId = request.PostId,
                Privacy = request.Privacy,
                UserId = _contextAccessor.HttpContext.User.GetUserId(),
                Tags = tags,
                ApprovalStatus = ApprovalStatus.APPROVED
            };

           
            var fullName = _contextAccessor.HttpContext.User.GetFullName();
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var imageUrl = _contextAccessor.HttpContext.User.GetAvatar();
            string contentNotification = $"{fullName} đã gắn thẻ bạn trong một bài viết";

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.PostRepository.CreatePostAsync(sharePost);

            var notifications = tags.Select(tag => new Domain.Entity.System.Notification
            {
                PostId = sharePost.Id,
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

            var sharePostNotification = new Domain.Entity.System.Notification()
            {
                ImageUrl = imageUrl,
                Content = $"{fullName} đã chia sẻ bài viết của bạn",
                Title = "Chia sẻ bài viết",
                PostId = sharePost.Id,
                IsRead = false,
                DateSent = DateTimeOffset.UtcNow,
                Type = NotificationType.POST_SHARED,
                RecipientId = post.UserId,
            };

            if(post.UserId != userId)
            {
                await _unitOfWork.NotificationRepository.CreateNotificationAsync(sharePostNotification);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);


            // SEND NOTIFICATION FOR POST OWNER (TYPE: SHARING)

            if (post.UserId != userId)
            {
                await _signalRService.SendNotificationToSpecificUser(post.User.UserName, ApplicationMapper.MapToNotification(sharePostNotification));
            }

            // SEND NOTIFICATION FOR ALL TAG USERS (TYPE: ASSIGN TAGS)

            foreach (var noti in notifications)
            {
                await _signalRService.SendNotificationToSpecificUser(noti.Recipient.UserName, ApplicationMapper.MapToNotification(noti));
            }

            return new DataResponse<PostResponse>
            {
                IsSuccess = true,
                Message = "Chia sẻ bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Data = ApplicationMapper.MapToPost(sharePost)
            };
        }
    }
}
