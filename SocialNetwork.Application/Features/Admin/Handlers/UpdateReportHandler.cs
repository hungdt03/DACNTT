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
            var report = await _unitOfWork.ReportRepository.GetReportByIdAsync(request.Id)
                ?? throw new AppException("Không có report nào cả");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();

            string content = request.NewStatus switch
            {
                ReportStatus.RESOLVED => "đã xử lý",
                ReportStatus.REJECTED => "đã từ chối",
                _ => "đang xử lý"
            };

            var notifications = new List<Domain.Entity.System.Notification>();

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

            //if ((report.ReportType == ReportType.COMMENT && request.IsDelete) || (report.ReportType == ReportType.POST && request.IsDelete))
            //{
            //    var targetEntity = report.ReportType == ReportType.COMMENT ? (object)report.TargetComment : report.TargetPost;
            //    var targetUserId = report.ReportType == ReportType.COMMENT ? report.TargetComment.UserId : report.TargetPost.UserId;
            //    var targetUser = report.ReportType == ReportType.COMMENT ? report.TargetComment.User : report.TargetPost.User;

            //    var notiToUser = new Domain.Entity.System.Notification
            //    {
            //        ReportId = request.Id,
            //        CommentId = report.TargetCommentId,
            //        PostId = report.TargetPostId,
            //        ImageUrl = userAvatar,
            //        IsRead = false,
            //        Title = report.ReportType == ReportType.COMMENT ? "Thông báo gỡ bình luận" : "Thông báo gỡ bài viết",
            //        Content = report.ReportType switch
            //        {
            //            ReportType.COMMENT => $"Chúng tôi đã xóa bình luận của bạn, nhấn vào để xem chi tiết",
            //            ReportType.POST => $"Chúng tôi đã xóa bài viết của bạn, nhấn vào để xem chi tiết",
            //            _ => string.Empty
            //        },
            //        RecipientId = targetUserId,
            //        Recipient = targetUser,
            //        Type = NotificationType.REPORT_DELETE_RESPONSE,
            //        DateSent = DateTimeOffset.UtcNow
            //    };

            //    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiToUser);
            //    notifications.Add(notiToUser);
            //}
            if ((report.ReportType == ReportType.COMMENT && request.IsDelete) ||
    (report.ReportType == ReportType.GROUP && request.IsDelete) ||
    (report.ReportType == ReportType.POST && request.IsDelete))
            {
                var targetEntity = report.ReportType switch
                {
                    ReportType.COMMENT => (object)report.TargetComment,
                    ReportType.POST => report.TargetPost,
                    ReportType.GROUP => report.TargetGroup,
                    _ => null
                };

                if (report.ReportType == ReportType.GROUP)
                {
                    // Lấy danh sách tất cả Admin trong nhóm
                    var adminUsers = report?.TargetGroup?.Members
                                        .Where(m => m.Role == "ADMIN")
                                        .Select(m => (m.UserId, m.User))
                                        .ToList();

                    foreach (var (targetUserId, targetUser) in adminUsers)
                    {
                        var notiToAdmin = new Domain.Entity.System.Notification
                        {
                            ReportId = request.Id,
                            GroupId = report?.TargetGroupId,
                            ImageUrl = userAvatar,
                            IsRead = false,
                            Title = "Thông báo giải tán nhóm",
                            Content = "Chúng tôi đã giải tán nhóm của bạn, nhấn vào để xem chi tiết",
                            RecipientId = targetUserId,
                            Recipient = targetUser,
                            Type = NotificationType.REPORT_DELETE_RESPONSE,
                            DateSent = DateTimeOffset.UtcNow
                        };

                        await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiToAdmin);
                        notifications.Add(notiToAdmin);
                    }
                }
                else
                {
                    var targetUserId = report.ReportType == ReportType.COMMENT ? report?.TargetComment?.UserId : report?.TargetPost?.UserId;
                    var targetUser = report?.ReportType == ReportType.COMMENT ? report?.TargetComment?.User : report?.TargetPost?.User;

                    var notiToUser = new Domain.Entity.System.Notification
                    {
                        ReportId = request.Id,
                        CommentId = report?.TargetCommentId,
                        PostId = report?.TargetPostId,
                        ImageUrl = userAvatar,
                        IsRead = false,
                        Title = report?.ReportType == ReportType.COMMENT ? "Thông báo gỡ bình luận" : "Thông báo gỡ bài viết",
                        Content = report?.ReportType == ReportType.COMMENT
                            ? "Chúng tôi đã xóa bình luận của bạn, nhấn vào để xem chi tiết"
                            : "Chúng tôi đã xóa bài viết của bạn, nhấn vào để xem chi tiết",
                        RecipientId = targetUserId,
                        Recipient = targetUser,
                        Type = NotificationType.REPORT_DELETE_RESPONSE,
                        DateSent = DateTimeOffset.UtcNow
                    };

                    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notiToUser);
                    notifications.Add(notiToUser);
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
    }
}
