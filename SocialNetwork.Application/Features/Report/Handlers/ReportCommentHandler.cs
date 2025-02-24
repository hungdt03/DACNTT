

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Report.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class ReportCommentHandler : IRequestHandler<ReportCommentCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ReportCommentHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ReportCommentCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            Domain.Entity.GroupInfo.Group? findGroup = null;
            if (request.GroupId.HasValue)
            {
                findGroup = await _unitOfWork.GroupRepository
                    .GetGroupByIdAsync(request.GroupId.Value)
                        ?? throw new NotFoundException("Thông tin nhóm không tồn tại");


                if (findGroup.Privacy == GroupPrivacy.PRIVATE)
                {
                    var member = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(findGroup.Id, userId)
                        ?? throw new AppException("Bạn không phải là thành viên của nhóm nên không thể báo cáo bài viết của một nhóm riêng tư");
                }
            }

            var comment = await _unitOfWork.CommentRepository
                .GetCommentByIdAsync(request.CommentId)
                    ?? throw new NotFoundException("Bình luận không tồn tại hoặc có thể đã bị xóa");

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(comment.PostId)
                ?? throw new NotFoundException("Bình luận này không thuộc bài viết nào cả");

            if (findGroup != null && post.GroupId != findGroup.Id)
                throw new AppException("Bình luận này không thuộc nhóm bạn báo cáo");

            if (comment.UserId == userId) throw new AppException("Không thể tự báo cáo bình luận của chính mình");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newReport = new Domain.Entity.System.Report()
            {
                Reason = request.Reason,
                ReporterId = userId,
                ReportType = ReportType.COMMENT,
                Status = ReportStatus.PENDING,
                TargetCommentId = comment.Id,
            };

            if (findGroup != null)
            {
                newReport.GroupId = findGroup.Id;
            } 

            await _unitOfWork.ReportRepository.CreateNewReportAsync(newReport);

            List<Domain.Entity.System.User> adminUsers = [];
            var userFullName = _contextAccessor.HttpContext.User.GetFullName();
            var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();
            List<Domain.Entity.System.Notification> notifications = [];
            if (findGroup != null)
            {

                adminUsers = (await _unitOfWork.GroupMemberRepository
                     .GetAllAdminAndModeratoInGroupAsync(findGroup.Id)).Select(gr => gr.User).ToList();

                foreach (var admin in adminUsers)
                {
                    var notification = new Domain.Entity.System.Notification()
                    {
                        Title = "Báo cáo bình luận",
                        Content = $"{userFullName} đã báo cáo một bình luận trong nhóm. Vào trang báo cáo để xem",
                        ReportId = newReport.Id,
                        IsRead = false,
                        DateSent = DateTimeOffset.UtcNow,
                        ImageUrl = $"{userAvatar}",
                        Type = NotificationType.REPORT_GROUP_COMMENT,
                        GroupId = findGroup.Id,
                        RecipientId = admin.Id,
                        Recipient = admin
                    };

                    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
                    notifications.Add(notification);
                }
            }
            else
            {
                // REPORT FOR ADMIN OF APP
                adminUsers = await _unitOfWork.UserRepository
                   .GetAllRoleAdmin();

                foreach (var admin in adminUsers)
                {
                    var notification = new Domain.Entity.System.Notification()
                    {
                        Title = "Báo cáo bình luận",
                        Content = $"{userFullName} đã báo cáo một bình luận trong nhóm. Vào trang báo cáo để xem",
                        ReportId = newReport.Id,
                        IsRead = false,
                        DateSent = DateTimeOffset.UtcNow,
                        ImageUrl = $"{userAvatar}",
                        Type = NotificationType.REPORT_COMMENT,
                        RecipientId = admin.Id,
                        Recipient = admin
                    };

                    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
                    notifications.Add(notification);
                }
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            foreach (var notification in notifications)
            {
                await _signalRService.SendNotificationToSpecificUser(notification.Recipient.UserName, ApplicationMapper.MapToNotification(notification));
            }

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Báo cáo bình luận thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
