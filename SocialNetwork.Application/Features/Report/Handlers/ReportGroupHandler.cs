

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Report.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using System.Security.Cryptography;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class ReportGroupHandler : IRequestHandler<ReportGroupCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ReportGroupHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ReportGroupCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var group = await _unitOfWork.GroupRepository
                .GetGroupByIdAsync(request.GroupId)
                    ?? throw new NotFoundException("Không tìm thấy nhóm");

            if (group.Privacy == GroupPrivacy.PRIVATE)
            {
                var member = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(group.Id, userId)
                    ?? throw new AppException("Bạn không phải là thành viên của nhóm nên không thể báo cáo bài viết của một nhóm riêng tư");
            }

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newReport = new Domain.Entity.System.Report()
            {
                ReporterId = userId,
                Reason = request.Reason,
                ReportType = ReportType.GROUP,
                TargetGroupId = request.GroupId,
                Status = ReportStatus.PENDING,
            };

            await _unitOfWork.ReportRepository.CreateNewReportAsync(newReport);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Báo cáo nhóm thành công và đã được gửi đi cho quản trị hệ thống",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
