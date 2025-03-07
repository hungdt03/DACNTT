using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class DeletePostHandler : IRequestHandler<DeletePostCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public DeletePostHandler(ISignalRService signalRService, UserManager<Domain.Entity.System.User> userManager, IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(DeletePostCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Không tìm thấy bài viết");

            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            var userRole = await _userManager.GetRolesAsync(user);

            if(userRole[0] == "USER")
            {
                if (post.GroupId != null)
                {
                    var groupMember = await _unitOfWork.GroupMemberRepository
                        .GetGroupMemberByGroupIdAndUserId(post.GroupId.Value, userId)
                            ?? throw new AppException("Bạn không thể xóa bài viết này");

                    if (groupMember.Role != MemberRole.ADMIN && post.UserId != userId)
                    {
                        throw new AppException("Bạn không thể xóa bài viết này");
                    }
                }

                if (userId != post.UserId)
                    throw new AppException("Không thể xóa bài viết");
            } 

            var reactions = await _unitOfWork.ReactionRepository.GetAllReactionsByPostIdAsync(request.PostId);
            var comments = await _unitOfWork.CommentRepository.GetAllCommentsByPostIdAsync(request.PostId);
            var sharePosts = await _unitOfWork.PostRepository.GetAllSharePostsByOriginalPostId(request.PostId);
            var tags = await _unitOfWork.TagRepository.GetAllTagsByPostIdAsync(post.Id);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.ReactionRepository.RemoveRange(reactions);
            _unitOfWork.CommentRepository.RemoveRange(comments);
            _unitOfWork.TagRepository.RemoveRange(tags);
            UpdateSharedPosts(sharePosts, post);
            _unitOfWork.PostRepository.DeletePost(post);

            //if (_contextAccessor.HttpContext.User.GetUserRole() == "ADMIN")
            //{
            //    await NotifyUser(post);
            //}

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new DataResponse<PostResponse>()
            {
                Data = ApplicationMapper.MapToPost(post),
                IsSuccess = true,
                Message = "Xóa bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        private void UpdateSharedPosts(IEnumerable<Domain.Entity.PostInfo.Post> sharePosts, Domain.Entity.PostInfo.Post post)
        {
            foreach (var p in sharePosts)
            {
                if (post.PostType == PostType.ORIGINAL_POST)
                {
                    p.SharePostId = (p.SharePostId == p.OriginalPostId) ? null : p.SharePostId;
                    p.OriginalPostId = null;
                }
                else
                {
                    p.SharePostId = null;
                }
            }
        }
        //private async Task NotifyUser(Domain.Entity.PostInfo.Post post)
        //{
        //    var notification = new Domain.Entity.System.Notification
        //    {
        //        ImageUrl = _contextAccessor.HttpContext.User.GetAvatar(),
        //        IsRead = false,
        //        Title = "Thông báo gỡ bài viết",
        //        RecipientId = post.UserId,
        //        Recipient = post.User,
        //        Type = NotificationType.POST_DELETE_RESPONSE,
        //        DateSent = DateTimeOffset.UtcNow,
        //        Content = "Chúng tôi đã xóa bài viết của bạn, nhấn vào để xem chi tiết",
        //        Post = post,
        //        PostId = post.Id
        //    };

        //    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
        //    var mappedNotification = ApplicationMapper.MapToNotification(notification);
        //    await _signalRService.SendNotificationToSpecificUser(mappedNotification.Recipient.FullName, mappedNotification);
        //}
    }
}
