
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
    public class AcceptInviteByAdminHandler : IRequestHandler<AcceptInviteByAdminCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public AcceptInviteByAdminHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(AcceptInviteByAdminCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var invitation = await _unitOfWork.GroupInvitationRepository
                .GetGroupInvitationByIdAsync(request.InviteId)
                ?? throw new NotFoundException("Lời mời không tồn tại");

            var groupMember = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(invitation.GroupId, userId);

            if (groupMember == null || groupMember.Role == MemberRole.MEMBER)
                throw new AppException("Quyền truy cập bị từ chối");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newGroupMember = new GroupMember()
            {
                GroupId = invitation.GroupId,
                Role = MemberRole.MEMBER,
                JoinDate = DateTimeOffset.UtcNow,
                UserId = invitation.InviteeId,
            };

            await _unitOfWork.GroupMemberRepository.CreateGroupMemberAsync(newGroupMember);

            var notification = new Domain.Entity.System.Notification()
            {
                Title = "Phê duyệt lời mời",
                Content = "Quản trị viên/ Người kiểm duyệt đã phê duyệt yêu cầu tham gia nhóm của bạn",
                GroupInvitationId = request.InviteId,
                GroupId = invitation.GroupId,
                ImageUrl = invitation.Group.CoverImage,
                DateSent = DateTimeOffset.UtcNow,
                IsRead = false,
                Type = NotificationType.APPROVAL_GROUP_INVITATION,
                RecipientId = invitation.InviteeId,
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification); 

            _unitOfWork.GroupInvitationRepository.RemoveGroupInvitation(invitation);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var savedNotification = await _unitOfWork.NotificationRepository
                .GetNotificationByIdAsync(notification.Id);

            if(savedNotification != null)
                await _signalRService.SendNotificationToSpecificUser(invitation.Invitee.UserName, ApplicationMapper.MapToNotification(savedNotification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã phê duyệt lời mời này",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
