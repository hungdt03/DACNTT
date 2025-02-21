
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
    public class ReportPostHandler : IRequestHandler<ReportPostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ReportPostHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ReportPostCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            Domain.Entity.GroupInfo.Group? findGroup = null;
            if (request.GroupId.HasValue)
            {
                findGroup = await _unitOfWork.GroupRepository
                    .GetGroupByIdAsync(request.GroupId.Value)
                        ?? throw new NotFoundException("Thông tin nhóm không tồn tại");

                if (findGroup.Privacy == GroupPrivacy.PRIVATE)
                {
                    var member = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(findGroup.Id, userId)
                        ?? throw new AppException("Bạn không phải là thành viên của nhóm nên không thể báo cáo bài viết của một nhóm riêng tư");
                }
            }

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Bài viết bạn báo cáo đã có thể bị xóa hoặc không tồn tại");

            if (post != null && findGroup != null && post.GroupId != findGroup.Id)
                throw new AppException("Bài viết này không thuộc nhóm bạn báo cáo");

            if (userId == post.UserId) throw new AppException("Không thể tự báo cáo bài viết của chính mình");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newReport = new Domain.Entity.System.Report()
            {
                ReporterId = userId,
                ReportType = ReportType.POST,
                Reason = request.Reason,
                Status = ReportStatus.PENDING,
                TargetPostId = request.PostId,
            };

            if(findGroup != null)
            {
                newReport.GroupId = findGroup.Id;
            }

            await _unitOfWork.ReportRepository.CreateNewReportAsync(newReport);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            string messageResponse = findGroup != null ? "Báo cáo bài viết thành công và đã được gửi đi cho quản trị viên của nhóm" : "Báo cáo bài viết thành công và đã được gửi đi cho người quản trị hệ thống";

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = messageResponse,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
