
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
    public class InviteUserAsModeratorHandler : IRequestHandler<InviteUserAsModeratorCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public InviteUserAsModeratorHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(InviteUserAsModeratorCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var memberAsModerator = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByIdAsync(request.MemberId)
                    ?? throw new NotFoundException("Người này không phải là thành viên của nhóm");

            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(memberAsModerator.GroupId, userId);

            if (member == null || member.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không có quyền mời thành viên khác làm người kiểm duyệt");

            var existedInvitations = await _unitOfWork.GroupRoleInvitationRepository
                           .AnyRoleInvitaionAsync(memberAsModerator.UserId, memberAsModerator.GroupId);

            if (existedInvitations)
                throw new AppException("Người này đã được gửi lời mời trước đó");

            if (memberAsModerator.Role != MemberRole.MEMBER)
                throw new AppException("Thành viên này đã đang làm người kiểm duyệt hoặc QTV");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var inviteModerator = new GroupRoleInvitation()
            {
                Role = MemberRole.MODERATOR,
                InviteeId = memberAsModerator.UserId,
                InviterId = userId,
                GroupId = memberAsModerator.GroupId,
            };

            await _unitOfWork.GroupRoleInvitationRepository.CreateNewInvitationAsync(inviteModerator);


            var notification = new Domain.Entity.System.Notification()
            {
                GroupRoleInvitationId = inviteModerator.Id,
                Title = "Mời làm người kiểm duyệt",
                Content = $"{member.User.FullName} đã mời bạn làm người kiểm duyệt của nhóm {member.Group.Name}",
                IsRead = false,
                ImageUrl = member.Group.CoverImage,
                RecipientId = memberAsModerator.UserId,
                Type = NotificationType.INVITE_ROLE_GROUP,
                DateSent = DateTimeOffset.UtcNow,
                GroupId = inviteModerator.GroupId,
            };
            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var savedNotification = await _unitOfWork.NotificationRepository.GetNotificationByIdAsync(notification.Id);
            if (savedNotification != null)
            {
                await _signalRService.SendNotificationToSpecificUser(memberAsModerator.User.UserName, ApplicationMapper.MapToNotification(savedNotification));
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
