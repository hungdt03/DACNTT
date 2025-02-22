using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class UpdateReportHandler : IRequestHandler<UpdateReportCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public UpdateReportHandler(ISignalRService signalRService, IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(UpdateReportCommand request, CancellationToken cancellationToken)
        {
            var report = await _unitOfWork.ReportRepository.GetReportByIdIgnoreAsync(request.Id)
                ?? throw new AppException("Không có report nào cả");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();

            var notifications = new List<Domain.Entity.System.Notification>();

            HandleReportRessponseNotification(request, report, userAvatar, notifications);

            if ((report.ReportType == ReportType.COMMENT && request.IsDelete) ||
                (report.ReportType == ReportType.GROUP && request.IsDelete))
            {
                var targetEntity = report.ReportType switch
                {
                    ReportType.COMMENT => (object)report.TargetComment,
                    ReportType.GROUP => report.TargetGroup,
                    _ => null
                };

                if (report.ReportType == ReportType.GROUP)
                {
                    HandleGroupNotification(report, userAvatar, notifications);
                }
                else
                {
                    HandleCommentNotification(report, userAvatar, notifications);
                }
            }

            //await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            await _unitOfWork.ReportRepository.UpdateReport(request.Id, request.NewStatus, request.NewReportSolution);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            foreach (var noti in notifications)
            {
                var mappedNotification = ApplicationMapper.MapToNotification(noti);
                await _signalRService.SendNotificationToSpecificUser(noti.Recipient.UserName, mappedNotification);
            }

            return new BaseResponse
            {
                IsSuccess = true,
                Message = "Cập nhật báo cáo thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }

        public async void HandleCommentNotification(Domain.Entity.System.Report report, string userAvatar, List<Domain.Entity.System.Notification> notifications)
        {
            var notiToUser = new Domain.Entity.System.Notification
            {
                ReportId = report.Id,
                CommentId = report?.TargetCommentId,
                PostId = report?.TargetPostId,
                ImageUrl = userAvatar,
                IsRead = false,
                Title = "Thông báo gỡ bình luận",
                Content = "Chúng tôi đã xóa bình luận của bạn, nhấn vào để xem chi tiết",
                RecipientId = report?.TargetComment?.UserId,
                Recipient = report?.TargetComment?.User,
                Type = NotificationType.COMMENT_DELETE_RESPONSE,
                DateSent = DateTimeOffset.UtcNow
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiToUser);
            notifications.Add(notiToUser);
        }
        public async void HandleGroupNotification(Domain.Entity.System.Report report, string userAvatar, List<Domain.Entity.System.Notification> notifications)
        {
            // Lấy danh sách tất cả Admin trong nhóm
            var adminUsers = await _unitOfWork.GroupMemberRepository
                .GetAllAdminAndModeratoInGroupAsync(report.TargetGroupId.Value);

            foreach (var adminUser in adminUsers)
            {
                var notiToAdmin = new Domain.Entity.System.Notification
                {
                    ReportId = report.Id,
                    GroupId = report?.TargetGroupId,
                    ImageUrl = userAvatar,
                    IsRead = false,
                    Title = "Thông báo giải tán nhóm",
                    Content = "Chúng tôi đã giải tán nhóm của bạn, nhấn vào để xem chi tiết",
                    RecipientId = adminUser.UserId,
                    Recipient = adminUser.User,
                    Type = NotificationType.GROUP_DELETE_RESPONSE,
                    DateSent = DateTimeOffset.UtcNow
                };

                await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiToAdmin);
                notifications.Add(notiToAdmin);
            }
        }
        public async void HandleReportRessponseNotification(UpdateReportCommand request, Domain.Entity.System.Report report, string userAvatar, List<Domain.Entity.System.Notification> notifications)
        {
            string content = request.NewStatus switch
            {
                ReportStatus.RESOLVED => "đã xử lý",
                ReportStatus.REJECTED => "đã từ chối",
                _ => "đang xử lý"
            };
            var notification = new Domain.Entity.System.Notification
            {
                ReportId = request.Id,
                ImageUrl = userAvatar,
                IsRead = false,
                Title = "Phản hồi báo cáo",
                RecipientId = report.ReporterId,
                Recipient = report.Reporter,
                Type = NotificationType.REPORT_RESPONSE,
                DateSent = DateTimeOffset.UtcNow,
                Content = report.ReportType switch
                {
                    ReportType.USER => $"Chúng tôi {content} báo cáo của bạn về tài khoản {report.TargetUser?.FullName}",
                    ReportType.COMMENT => $"Chúng tôi {content} báo cáo của bạn về bình luận của {report.TargetComment?.User.FullName}",
                    ReportType.POST => $"Chúng tôi {content} báo cáo của bạn về bài viết của {report.TargetPost?.User.FullName}",
                    ReportType.GROUP => $"Chúng tôi {content} báo cáo của bạn về nhóm {report.TargetGroup?.Name}",
                    _ => string.Empty
                },
                Comment = report.TargetComment,
                CommentId = report.TargetCommentId,
                Post = report.TargetPost,
                PostId = report.TargetPostId,
                Group = report.TargetGroup,
                GroupId = report.TargetGroupId
            };
            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            notifications.Add(notification);

        }
    }
}
