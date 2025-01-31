
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class AcceptInviteFriendHandler : IRequestHandler<AcceptInviteFriendCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public AcceptInviteFriendHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(AcceptInviteFriendCommand request, CancellationToken cancellationToken)
        {
            var invitation = await _unitOfWork.GroupInvitationRepository.GetGroupInvitationByIdAsync(request.InviteId);

            if (invitation == null || invitation.Status == true)
                throw new NotFoundException("Lời mời không tồn tại hoặc không còn nữa");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            if (invitation.InviteeId != userId)
                throw new AppException("Bạn không có quyền chấp nhận lời mời này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            invitation.Status = true;

            var groupInvitation = new GroupMember()
            {
                GroupId = invitation.GroupId,
                IsAdmin = false,
                JoinDate = DateTimeOffset.UtcNow,
                UserId = userId,
            };

            await _unitOfWork.GroupMemberRepository.CreateGroupMemberAsync(groupInvitation);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Chấp nhận tham gia nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };

        }
    }
}
