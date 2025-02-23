

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

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class ReportGroupHandler : IRequestHandler<ReportGroupCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ReportGroupHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ReportGroupCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var group = await _unitOfWork.GroupRepository
                .GetGroupByIdAsync(request.GroupId)
                    ?? throw new NotFoundException("Không tìm thấy nhóm");

            if (group.Privacy == GroupPrivacy.PRIVATE)
            {
                var member = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(group.Id, userId)
                    ?? throw new AppException("Bạn không phải là thành viên của nhóm nên không thể báo cáo bài viết của một nhóm riêng tư");

                if (member.Role == MemberRole.ADMIN) throw new AppException("Không thể báo cáo nhóm do bạn quản lí");
            }

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newReport = new Domain.Entity.System.Report()
            {
                ReporterId = userId,
                Reason = request.Reason,
                ReportType = ReportType.GROUP,
                TargetGroupId = request.GroupId,
                Status = ReportStatus.PENDING,
            };

            await _unitOfWork.ReportRepository.CreateNewReportAsync(newReport);

            var adminUsers = await _unitOfWork.UserRepository
                  .GetAllRoleAdmin();

            var userFullName = _contextAccessor.HttpContext.User.GetFullName();
            var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();
            List<Domain.Entity.System.Notification> notifications = [];
            foreach (var admin in adminUsers)
            {
                var notification = new Domain.Entity.System.Notification()
                {
                    Title = "Báo cáo người dùng",
                    Content = $"{userFullName} đã báo cáo nhóm {group.Name}. Vào trang báo cáo để xem",
                    ReportId = newReport.Id,
                    IsRead = false,
                    DateSent = DateTimeOffset.UtcNow,
                    ImageUrl = $"{userAvatar}",
                    Type = NotificationType.REPORT_GROUP,
                    GroupId = null,
                    RecipientId = admin.Id,
                    Recipient = admin
                };

                await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
                notifications.Add(notification);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            foreach (var notification in notifications)
            {
                foreach (var admin in adminUsers)
                {
                    await _signalRService.SendNotificationToSpecificUser(admin.UserName, ApplicationMapper.MapToNotification(notification));
                }
            }

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Báo cáo nhóm thành công và đã được gửi đi cho quản trị hệ thống",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
