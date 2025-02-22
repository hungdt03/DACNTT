

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
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class ReportUserHandler : IRequestHandler<ReportUserCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ReportUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ReportUserCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            Domain.Entity.GroupInfo.Group? findGroup = null;
            if (request.GroupId.HasValue)
            {
                findGroup = await _unitOfWork.GroupRepository
                    .GetGroupByIdAsync(request.GroupId.Value)
                        ?? throw new NotFoundException("Thông tin nhóm không tồn tại");

                if(findGroup.Privacy == GroupPrivacy.PRIVATE)
                {
                    var member = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(findGroup.Id, userId)
                        ?? throw new AppException("Bạn không phải là thành viên của nhóm nên không thể báo cáo thành viên của một nhóm riêng tư");
                }

                var reportUser = await _unitOfWork.GroupMemberRepository
                    .GetGroupMemberByGroupIdAndUserId(findGroup.Id, request.UserId)
                        ?? throw new AppException("Người bạn báo cáo không phải là thành viên của nhóm bạn cung cấp");
            }

            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(request.UserId)
                ?? throw new NotFoundException("Thông tin user bạn báo cáo không tồn tại");
            
            if (user.Id == userId)
                throw new AppException("Không thể tự báo cáo chính mình");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newReport = new Domain.Entity.System.Report()
            {
                Reason = request.Reason,
                ReporterId = userId,
                ReportType = ReportType.USER,
                Status = ReportStatus.PENDING,
                TargetUserId = request.UserId,
            };


            if (findGroup != null)
            {
                newReport.GroupId = findGroup.Id;

            }

            await _unitOfWork.ReportRepository.CreateNewReportAsync(newReport);

            List<GroupMember> groupAdmins = [];
            List<Domain.Entity.System.Notification> notifications = [];
            if (findGroup != null)
            {
                var userFullName = _contextAccessor.HttpContext.User.GetFullName();
                var userAvatar = _contextAccessor.HttpContext.User.GetFullName();
                groupAdmins = await _unitOfWork.GroupMemberRepository
                    .GetAllAdminAndModeratoInGroupAsync(findGroup.Id);

                foreach(var admin in groupAdmins)
                {
                    var notification = new Domain.Entity.System.Notification()
                    {
                        Title = "Báo cáo người dùng",
                        Content = $"{userFullName} đã báo cáo người dùng tên {user.FullName}. Vào trang báo cáo để xem",
                        ReportId = newReport.Id,
                        IsRead = false,
                        DateSent = DateTimeOffset.UtcNow,
                        ImageUrl = $"{userAvatar}",
                        Type = NotificationType.REPORT_GROUP_MEMBER,
                        GroupId = findGroup.Id,
                        RecipientId = admin.UserId,
                    };

                    await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
                    notifications.Add(notification);
                }
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            if(findGroup != null)
            {
                foreach(var notification in notifications)
                {
                    foreach(var admin in groupAdmins)
                    {
                        await _signalRService.SendNotificationToSpecificUser(admin.User.UserName, ApplicationMapper.MapToNotification(notification));
                    }
                }
            }

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Báo cáo người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
