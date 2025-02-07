
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Common.Helpers;
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
           if (request.Images != null || request.Videos != null)
            {
                var totalFiles = request.Images != null && request.Videos != null 
                    ? request.Images.Concat(request.Videos).ToList()
                    : request.Images ?? request.Videos?.ToList();

                long maxSizeInBytes = 50 * 1024 * 1024; 
                if (FileValidationHelper.AreFilesTooLarge(totalFiles, maxSizeInBytes))
                {
                     throw new AppException("Tổng kích thước các tệp vượt quá giới hạn 50MB.");
                }
            }

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var post = new Domain.Entity.PostInfo.Post
            {
                Content = request.Content,
                PostType = PostType.ORIGINAL_POST,
                Privacy = request.Privacy,
                UserId = userId,
                Background = request.Background,
                ApprovalStatus = ApprovalStatus.APPROVED,
            };

            if (request.GroupId.HasValue)
            {
                var group = await _unitOfWork.GroupRepository.GetGroupByIdAsync(request.GroupId.Value)
                    ?? throw new NotFoundException("Mã nhóm không tồn tại");

                var member = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId.Value, userId);

                if (group.Privacy == GroupPrivacy.PRIVATE)
                {
                    if(member == null) throw new AppException("Bạn không phải thành viên nên không thể đăng bài trong nhóm riêng tư");

                    if (group.OnlyAdminCanPost && member.Role == MemberRole.MEMBER)
                    {
                         throw new AppException("Chỉ có QTV hoặc người kiểm duyệt mới được phép đăng bài trong nhóm này");
                    }

                    if (group.RequirePostApproval)
                    {
                        if (member.Role != MemberRole.MEMBER)
                            post.ApprovalStatus = ApprovalStatus.APPROVED;

                        else post.ApprovalStatus = ApprovalStatus.PENDING;
                    }
                    else post.ApprovalStatus = ApprovalStatus.APPROVED;

                    post.Privacy = PrivacyConstant.GROUP_PRIVATE;
                }
                else post.Privacy = PrivacyConstant.GROUP_PUBLIC;

                post.PostType = PostType.ORIGINAL_POST;
                post.Group = group;
                post.GroupId = group.Id;
                post.IsGroupPost = true;
            }

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

            if(medias.Count > 0)
            {
                post.Medias = medias;
            }

            var tags = new List<Tag>();
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

            if(tags.Count > 0) post.Tags = tags;

            var fullName = _contextAccessor.HttpContext.User.GetFullName();
            var imageUrl = _contextAccessor.HttpContext.User.GetAvatar();
            string contentNotification = $"{fullName} đã gắn thẻ bạn trong một bài viết";

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.PostRepository.CreatePostAsync(post);

            var notifications = tags.Select(tag => new Domain.Entity.System.Notification
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
                await _signalRService.SendNotificationToSpecificUser(noti.Recipient.UserName, ApplicationMapper.MapToNotification(noti));
            }

            var savedPost = await _unitOfWork.PostRepository.GetPostByIdAsync(post.Id);
            var mapPost = ApplicationMapper.MapToPost(savedPost);
            var haveStory = await _unitOfWork.StoryRepository
                    .IsUserHaveStoryAsync(post.UserId);
            mapPost.User.HaveStory = haveStory;

            return new DataResponse<PostResponse>
            {
                IsSuccess = true,
                Message = (post.ApprovalStatus == ApprovalStatus.APPROVED && post.IsGroupPost) || !post.IsGroupPost ? "Tạo bài viết mới thành công" : "Bài viết của bạn đã được gửi tới quản trị viên chờ phê duyệt",
                StatusCode = System.Net.HttpStatusCode.OK,
                Data = (post.ApprovalStatus == ApprovalStatus.APPROVED && post.IsGroupPost) || !post.IsGroupPost ? mapPost : null
            };
        }
    }
}
