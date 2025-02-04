
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class KickGroupMemberHandler : IRequestHandler<KickGroupMemberCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public KickGroupMemberHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(KickGroupMemberCommand request, CancellationToken cancellationToken)
        {
            var groupMember = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByIdAsync(request.GroupMemberId)
                    ?? throw new NotFoundException("Người này không phải là thành viên của nhóm");

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(groupMember.GroupId, userId);

            if (member == null || member.Role != MemberRole.ADMIN) throw new AppException("Bạn không quyền xóa người này khỏi nhóm");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.GroupMemberRepository.RemoveGroupMember(groupMember);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xóa thành viên khỏi nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
