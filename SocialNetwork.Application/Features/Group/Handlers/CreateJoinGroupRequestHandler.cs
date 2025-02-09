using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class CreateJoinGroupRequestHandler : IRequestHandler<CreateJoinGroupRequestCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalService;

        public CreateJoinGroupRequestHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalService = signalRService;
        }

        public async Task<BaseResponse> Handle(CreateJoinGroupRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var group = await _unitOfWork.GroupRepository.GetGroupByIdAsync(request.GroupId)
                ?? throw new NotFoundException("Nhóm không tồn tại");

            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            if (groupMember != null) throw new AppException("Bạn đã là thành viên của nhóm");
            
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            string message = "Yêu cầu xin tham gia nhóm của bạn đã được gửi đi";

            JoinGroupRequest joinGroupRequest = null;
            if (group.RequireApproval)
            {
                joinGroupRequest = new JoinGroupRequest()
                {
                    GroupId = request.GroupId,
                    Status = false,
                    UserId = userId,
                };

                await _unitOfWork.JoinGroupRequestRepository.CreateJoinGroupRequestAsync(joinGroupRequest);

                var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();
                var userFullname = _contextAccessor.HttpContext.User.GetFullName();

                var adminAndModerators = await _unitOfWork.GroupMemberRepository
                 .GetAllAdminAndModeratoInGroupAsync(group.Id);

                foreach (var member in adminAndModerators)
                {
                    var newNotification = new Domain.Entity.System.Notification()
                    {
                        JoinGroupRequestId = joinGroupRequest.Id,
                        IsRead = false,
                        ImageUrl = userAvatar,
                        Content = $"{userFullname} đã yêu cầu tham gia nhóm {group.Name}",
                        Title = "Yêu cầu tham gia nhóm",
                        DateSent = DateTimeOffset.UtcNow,
                        Type = NotificationType.JOIN_GROUP_REQUEST,
                        RecipientId = member.UserId // Gán ID tại đây
                    };

                    await _unitOfWork.NotificationRepository.CreateNotificationAsync(newNotification);
                }

            }
            else
            {
                var newGroupMember = new GroupMember()
                {
                    GroupId = request.GroupId,
                    Role = MemberRole.MEMBER,
                    JoinDate = DateTimeOffset.UtcNow,
                    UserId = userId,
                };

                await _unitOfWork.GroupMemberRepository.CreateGroupMemberAsync(newGroupMember);
                message = "Bạn đã trở thành viên của nhóm";
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            if (joinGroupRequest != null)
            {
                var notifications = await _unitOfWork.NotificationRepository.GetAllNotificationsByJoinGroupRequestId(joinGroupRequest.Id);

                var tasks = notifications.Select(notification =>
                    _signalService.SendNotificationToSpecificUser(notification.Recipient.UserName,
                        ApplicationMapper.MapToNotification(notification))
                ).ToList();

                await Task.WhenAll(tasks); 
            }

            return new DataResponse<JoinGroupResponse>()
            {
                Data = new JoinGroupResponse()
                {
                    IsApproval = !group.RequireApproval
                },
                IsSuccess = true,
                Message = message,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
