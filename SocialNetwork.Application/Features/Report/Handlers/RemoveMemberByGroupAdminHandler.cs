

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Report.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class RemoveMemberByGroupAdminHandler : IRequestHandler<RemoveMemberByGroupAdminCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RemoveMemberByGroupAdminHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(RemoveMemberByGroupAdminCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var report = await _unitOfWork
                .ReportRepository.GetReportByIdAsync(request.ReportId)
                    ?? throw new AppException("Báo cáo này không tồn tại hoặc đã được xử lí");

            if (!report.GroupId.HasValue) throw new AppException("Báo cáo này do quản trị hệ thống xử lí");

            var groupMember = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(report.GroupId.Value, userId);

            if (groupMember == null || groupMember.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không đủ thẩm quyền để xóa người này khỏi nhóm");

            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(report.GroupId.Value, report.TargetUserId)
                    ?? throw new NotFoundException("Người này không phải thành viên của nhóm");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.GroupMemberRepository.RemoveGroupMember(member);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã xóa người dùng này khỏi nhóm",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
