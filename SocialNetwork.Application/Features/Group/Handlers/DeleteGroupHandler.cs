
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
    public class DeleteGroupHandler : IRequestHandler<DeleteGroupCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public DeleteGroupHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var groupMember = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            if (groupMember == null || groupMember.Role != MemberRole.ADMIN)
                throw new AppException("Quyền truy cập bị từ chối");

            var group = await _unitOfWork.GroupRepository
                .GetGroupByIdAsync(request.GroupId)
                ?? throw new NotFoundException("Nhóm không tồn tại");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.GroupRepository.RemoveGroup(group);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã giải tán nhóm",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
