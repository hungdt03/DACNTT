using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Common;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.System;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class UpdateReportHandler : IRequestHandler<UpdateReportCommand, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public UpdateReportHandler(ISignalRService _signalRService, IUnitOfWork unitOfWork, IHttpContextAccessor _contextAccessor)
        {
            this.unitOfWork = unitOfWork;
            this._contextAccessor = _contextAccessor;
            this._signalRService = _signalRService;
        }
        public async Task<BaseResponse> Handle(UpdateReportCommand request, CancellationToken cancellationToken)
        {
            var report = await unitOfWork.ReportRepository.GetReportByIdAsync(request.Id)
                ?? throw new AppException("không có report nào cả");
            
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();
            var content = "đang xử lý";
            if (request.NewStatus == ReportStatus.RESOLVED)
            {
                content = "đã xử lý";
            }
            if (request.NewStatus == ReportStatus.REJECTED)
            {
                content = "đã từ chối";
            }
            var notification = new Domain.Entity.System.Notification()
            {
                ReportId = request.Id,
                ImageUrl = userAvatar,
                IsRead = false,
                Title = "Phản hồi báo cáo",
                RecipientId = report.ReporterId,
                Recipient = report.Reporter,
                Type = NotificationType.REPORT_RESPONSE,
                DateSent = DateTimeOffset.UtcNow,
            };
            if (report?.ReportType == ReportType.USER)
            {
                notification.Content = $"Chúng tôi {content} báo cáo của bạn về tài khoản {report.TargetUser?.FullName}";
            }
            if (report?.ReportType == ReportType.COMMENT)
            {
                notification.Content = $"Chúng tôi {content} báo cáo của bạn về bình luận của {report.TargetComment?.User.FullName}";
                notification.Comment = report.TargetComment;
                notification.CommentId = report.TargetCommentId;
            }
            if (report?.ReportType == ReportType.POST)
            {
                notification.Content = $"Chúng tôi {content} báo cáo của bạn về bài viết của {report.TargetPost?.User.FullName}";
                notification.Post = report.TargetPost;
                notification.PostId = report.TargetPostId;
            }
            if (report?.ReportType == ReportType.GROUP)
            {
                notification.Content = $"Chúng tôi {content} báo cáo của bạn về nhóm {report.TargetGroup?.Name}";
                notification.Group = report.TargetGroup;
                notification.GroupId = report.TargetGroupId;
            }
            await unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            await unitOfWork.ReportRepository.UpdateReport(request.Id, request.NewStatus, request.NewReportSolution);

            await unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendNotificationToSpecificUser(ApplicationMapper.MapToNotification(notification).Recipient.FullName, ApplicationMapper.MapToNotification(notification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật báo cáo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
