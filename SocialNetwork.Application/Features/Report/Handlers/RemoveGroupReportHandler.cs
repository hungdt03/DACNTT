
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
    public class RemoveGroupReportHandler : IRequestHandler<RemoveGroupReportCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RemoveGroupReportHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(RemoveGroupReportCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var report = await _unitOfWork.ReportRepository
                .GetReportByIdAsync(request.ReportId)
                ?? throw new AppException("Báo cáo không tồn tại");

            if (!report.GroupId.HasValue) throw new AppException("Báo cáo này do quản trị hệ thống xử lí");

            var groupMember = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(report.GroupId.Value, userId);

            if (groupMember == null || groupMember.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không đủ thẩm quyền để xử lí báo cáo này");
           
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.ReportRepository.RemoveReport(report);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã quyết định giữ lại bình luận này",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
