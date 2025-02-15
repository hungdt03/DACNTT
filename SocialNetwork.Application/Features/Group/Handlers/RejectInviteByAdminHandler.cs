using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class RejectInviteByAdminHandler : IRequestHandler<RejectInviteByAdminCommand, BaseResponse>
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public RejectInviteByAdminHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }


        public async Task<BaseResponse> Handle(RejectInviteByAdminCommand request, CancellationToken cancellationToken)
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

            _unitOfWork.GroupInvitationRepository.RemoveGroupInvitation(invitation);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);
           
            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã từ chối lời mời này",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
