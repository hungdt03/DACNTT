

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Report.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class ReportUserHandler : IRequestHandler<ReportUserCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ReportUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ReportUserCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            Domain.Entity.GroupInfo.Group? findGroup = null;
            if (request.GroupId.HasValue)
            {
                findGroup = await _unitOfWork.GroupRepository
                    .GetGroupByIdAsync(request.GroupId.Value)
                        ?? throw new NotFoundException("Thông tin nhóm không tồn tại");

                if(findGroup.Privacy == GroupPrivacy.PRIVATE)
                {
                    var member = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(findGroup.Id, userId)
                        ?? throw new AppException("Bạn không phải là thành viên của nhóm nên không thể báo cáo thành viên của một nhóm riêng tư");
                }

                var reportUser = await _unitOfWork.GroupMemberRepository
                    .GetGroupMemberByGroupIdAndUserId(findGroup.Id, request.UserId)
                        ?? throw new AppException("Người bạn báo cáo không phải là thành viên của nhóm bạn cung cấp");
            }

            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(request.UserId)
                ?? throw new NotFoundException("Thông tin user bạn báo cáo không tồn tại");
            
            if (user.Id == userId)
                throw new AppException("Không thể tự báo cáo chính mình");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newReport = new Domain.Entity.System.Report()
            {
                Reason = request.Reason,
                ReporterId = userId,
                ReportType = ReportType.USER,
                Status = ReportStatus.PENDING,
                TargetUserId = request.UserId,
            };

            if (findGroup != null)
            {
                newReport.GroupId = findGroup.Id;
            }


            await _unitOfWork.ReportRepository.CreateNewReportAsync(newReport);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Báo cáo người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
