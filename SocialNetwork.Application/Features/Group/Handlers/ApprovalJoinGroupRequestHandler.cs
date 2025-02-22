

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
    public class ApprovalJoinGroupRequestHandler : IRequestHandler<ApprovalJoinGroupRequestCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;

        public ApprovalJoinGroupRequestHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork, ISignalRService signalRService)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ApprovalJoinGroupRequestCommand request, CancellationToken cancellationToken)
        {
            var joinGroupRequest = await _unitOfWork.JoinGroupRequestRepository.GetJoinGroupRequestByIdAsync(request.RequestId);

            if (joinGroupRequest == null) throw new NotFoundException("Yêu cầu không tồn tại hoặc đã được phê duyệt");

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(joinGroupRequest.GroupId, userId);

            if (groupMember == null || (groupMember.Group.OnlyAdminCanApprovalMember && groupMember.Role == MemberRole.MEMBER)) throw new AppException("Bạn không có quyền phê duyệt");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var invitation = await _unitOfWork.GroupInvitationRepository.GetGroupInvitationByInviteeIdAndGroupIdAsync(joinGroupRequest.UserId, joinGroupRequest.GroupId); ;

            if(invitation != null)
            {
                _unitOfWork.GroupInvitationRepository.RemoveGroupInvitation(invitation);
            }

            _unitOfWork.JoinGroupRequestRepository.RemoveJoinGroupRequest(joinGroupRequest);

            var newGroupMember = new GroupMember()
            {
                GroupId = joinGroupRequest.GroupId,
                Role = MemberRole.MEMBER,
                JoinDate = DateTimeOffset.UtcNow,
                UserId = joinGroupRequest.UserId,
            };
          
            await _unitOfWork.GroupMemberRepository.CreateGroupMemberAsync(newGroupMember);

            var notification = new Domain.Entity.System.Notification()
            {
                Title = "Phê duyệt lời mời",
                Content = $"Yêu cầu tham gia nhóm {joinGroupRequest.Group.Name} của bạn đã được phê duyệt",
                JoinGroupRequestId = joinGroupRequest.Id,
                GroupId = joinGroupRequest.GroupId,
                ImageUrl = joinGroupRequest.Group.CoverImage,
                DateSent = DateTimeOffset.UtcNow,
                IsRead = false,
                Type = NotificationType.APPROVAL_JOIN_GROUP_REQUEST,
                RecipientId = joinGroupRequest.UserId,
            };

            await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var savedNotification = await _unitOfWork.NotificationRepository.GetNotificationByIdAsync(notification.Id);
            if(savedNotification != null)
            {
                await _signalRService.SendNotificationToSpecificUser(savedNotification.Recipient.UserName, ApplicationMapper.MapToNotification(savedNotification));
            }

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Phê duyệt thành viên vào nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
