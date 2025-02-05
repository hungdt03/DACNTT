

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class AcceptRoleInvitationHandler : IRequestHandler<AcceptRoleInvitationCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public AcceptRoleInvitationHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(AcceptRoleInvitationCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var invitation = await _unitOfWork.GroupRoleInvitationRepository
                .GetByIdAsync(request.InvitationId)
                    ?? throw new NotFoundException("Lời mời không tồn tại");

            if (invitation.InviteeId != userId)
                throw new AppException("Bạn không phải là người được mời");

            var groupMember = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(invitation.GroupId, userId)
                    ?? throw new AppException("Bạn không phải là thành viên của nhóm");


            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            groupMember.Role = invitation.Role;
            _unitOfWork.GroupRoleInvitationRepository.RemoveRoleInvitation(invitation);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã chấp nhận lời mời",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
