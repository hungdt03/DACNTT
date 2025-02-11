
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class LeaveGroupHandler : IRequestHandler<LeaveGroupCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public LeaveGroupHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(LeaveGroupCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
        
            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId)
                    ?? throw new AppException("Bạn không phải là thành viên của nhóm");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (request.MemberId.HasValue)
            {
                var targetAdmin = await _unitOfWork.GroupMemberRepository.GetGroupMemberByIdAsync(request.MemberId.Value)
                    ?? throw new NotFoundException("Người này không phải là thành viên của nhóm");

                if (groupMember.Role != MemberRole.ADMIN)
                    throw new AppException("Bạn không có quyền chọn quản trị viên mới");

                var countAdmins = await _unitOfWork.GroupMemberRepository.CountAdminsByGroupIdAsync(request.GroupId);

                if (countAdmins <= 1)
                {
                    targetAdmin.Role = MemberRole.ADMIN;
                }
            }

            var countMembers = await _unitOfWork.GroupMemberRepository.CountGroupMembersByGroupIdAsync(request.GroupId);

            _unitOfWork.GroupMemberRepository.RemoveGroupMember(groupMember);

            if(countMembers == 1)
            {
                _unitOfWork.GroupRepository.RemoveGroup(groupMember.Group);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Rời nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
