﻿

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class RejectInviteFriendHandler : IRequestHandler<RejectInviteFriendCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RejectInviteFriendHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(RejectInviteFriendCommand request, CancellationToken cancellationToken)
        {
            var invitation = await _unitOfWork.GroupInvitationRepository.GetGroupInvitationByIdAsync(request.InviteId);

            if (invitation == null || invitation.Status == true)
                throw new NotFoundException("Lời mời không tồn tại hoặc không còn nữa");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            if (invitation.InviteeId != userId)
                throw new AppException("Bạn không có quyền từ chối lời mời này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.GroupInvitationRepository.RemoveGroupInvitation(invitation);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Hủy bỏ lời mời thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
