
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class ApprovalPostByGroupIdAndPostIdHandler : IRequestHandler<ApprovalPostByGroupIdAndPostIdCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ApprovalPostByGroupIdAndPostIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor  contextAccessor, ISignalRService signalRService)
        {
              _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ApprovalPostByGroupIdAndPostIdCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Bài viết không tồn tại");

            if (!post.IsGroupPost) throw new AppException("Đây không phải bài viết của nhóm");

            if (post.GroupId.Value != request.GroupId)
                throw new AppException("Bài viết không thuộc nhóm bạn cung cấp");

            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(post.GroupId.Value, userId);

            if (groupMember == null || groupMember.Role == MemberRole.MEMBER)
                throw new AppException("Bạn không có quyền phê duyệt bài viết");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            post.ApprovalStatus = ApprovalStatus.APPROVED;

            var notification = new Domain.Entity.System.Notification()
            {
                PostId = request.PostId,
                Content = $"Bài viết của bạn trong nhóm {post?.Group?.Name} đã được phê duyệt",
                ImageUrl = post?.Group?.CoverImage,
                Title = "Phê duyệt bài viết",
                IsRead = false,
                Type = NotificationType.APPROVAL_POST,
                DateSent = DateTimeOffset.UtcNow,
                GroupId = request.GroupId,
                RecipientId = post.UserId,
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendNotificationToSpecificUser(post.User.UserName, ApplicationMapper.MapToNotification(notification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Phê duyệt bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
