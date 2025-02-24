
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
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class ReportPostHandler : IRequestHandler<ReportPostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ReportPostHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ReportPostCommand request, CancellationToken cancellationToken)
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

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Bài viết bạn báo cáo đã có thể bị xóa hoặc không tồn tại");

            if (post != null && findGroup != null && post.GroupId != findGroup.Id)
                throw new AppException("Bài viết này không thuộc nhóm bạn báo cáo");

            if (userId == post.UserId) throw new AppException("Không thể tự báo cáo bài viết của chính mình");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newReport = new Domain.Entity.System.Report()
            {
                ReporterId = userId,
                ReportType = ReportType.POST,
                Reason = request.Reason,
                Status = ReportStatus.PENDING,
                TargetPostId = request.PostId,
            };

            if(findGroup != null)
            {
                newReport.GroupId = findGroup.Id;
            }

            await _unitOfWork.ReportRepository.CreateNewReportAsync(newReport);

            List<Domain.Entity.System.User> adminUsers = [];
            List<Domain.Entity.System.Notification> notifications = [];
            var userFullName = _contextAccessor.HttpContext.User.GetFullName();
            var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();
            if (findGroup != null)
            {
             
                adminUsers = (await _unitOfWork.GroupMemberRepository
                     .GetAllAdminAndModeratoInGroupAsync(findGroup.Id)).Select(gr => gr.User).ToList();

                foreach (var admin in adminUsers)
                {
                    var notification = new Domain.Entity.System.Notification()
                    {
                        Title = "Báo cáo bài viết",
                        Content = $"{userFullName} đã báo cáo một bài viết trong nhóm. Vào trang báo cáo để xem",
                        ReportId = newReport.Id,
                        IsRead = false,
                        DateSent = DateTimeOffset.UtcNow,
                        ImageUrl = $"{userAvatar}",
                        Type = NotificationType.REPORT_GROUP_POST,
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
                        Title = "Báo cáo bài viết",
                        Content = $"{userFullName} đã báo cáo một bài viết trong nhóm. Vào trang báo cáo để xem",
                        ReportId = newReport.Id,
                        IsRead = false,
                        DateSent = DateTimeOffset.UtcNow,
                        ImageUrl = $"{userAvatar}",
                        Type = NotificationType.REPORT_POST,
                        GroupId = null,
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

            string messageResponse = findGroup != null ? "Báo cáo bài viết thành công và đã được gửi đi cho quản trị viên của nhóm" : "Báo cáo bài viết thành công và đã được gửi đi cho người quản trị hệ thống";

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = messageResponse,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
