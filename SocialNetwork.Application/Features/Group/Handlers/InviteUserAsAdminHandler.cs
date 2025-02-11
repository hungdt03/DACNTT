

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class InviteUserAsAdminHandler : IRequestHandler<InviteUserAsAdminCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public InviteUserAsAdminHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(InviteUserAsAdminCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var memberAsAdmin = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByIdAsync(request.MemberId)
                    ?? throw new NotFoundException("Người này không phải là thành viên của nhóm");

            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(memberAsAdmin.GroupId, userId);

            if (member == null || member.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không có quyền mời thành viên khác làm QTV");

            var existedInvitations = await _unitOfWork.GroupRoleInvitationRepository
                .AnyRoleInvitaionAsync(memberAsAdmin.UserId, memberAsAdmin.GroupId);
          
            if (existedInvitations)
                throw new AppException("Người này đã được gửi lời mời trước đó");

            if (memberAsAdmin.Role == MemberRole.ADMIN)
                throw new AppException("Thành viên này đã đang làm QTV");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var inviteAdmin = new GroupRoleInvitation()
            {
                Role = MemberRole.ADMIN,
                InviteeId = memberAsAdmin.UserId,
                InviterId = userId,
                GroupId = memberAsAdmin.GroupId,
            };

            await _unitOfWork.GroupRoleInvitationRepository.CreateNewInvitationAsync(inviteAdmin);

            var notification = new Domain.Entity.System.Notification()
            {
                GroupRoleInvitationId = inviteAdmin.Id,
                Title = "Mời làm quản trị viên",
                Content = $"{member.User.FullName} đã mời bạn làm quản trị viên của nhóm {member.Group.Name}",
                IsRead = false,
                ImageUrl = member.Group.Name,
                RecipientId = memberAsAdmin.UserId,
                Type = NotificationType.INVITE_ROLE_GROUP,
                DateSent = DateTimeOffset.UtcNow,
                GroupId = inviteAdmin.GroupId,  
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var savedNotification = await _unitOfWork.NotificationRepository.GetNotificationByIdAsync(notification.Id);
            if(savedNotification != null)
            {
                await _signalRService.SendNotificationToSpecificUser(memberAsAdmin.User.UserName, ApplicationMapper.MapToNotification(savedNotification));
            }

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Gửi lời mời thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
