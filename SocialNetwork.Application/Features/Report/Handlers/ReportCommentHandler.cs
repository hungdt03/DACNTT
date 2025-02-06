

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
    public class ReportCommentHandler : IRequestHandler<ReportCommentCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ReportCommentHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ReportCommentCommand request, CancellationToken cancellationToken)
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

            var comment = await _unitOfWork.CommentRepository
                .GetCommentByIdAsync(request.CommentId)
                    ?? throw new NotFoundException("Bình luận không tồn tại hoặc có thể đã bị xóa");

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(comment.PostId)
                ?? throw new NotFoundException("Bình luận này không thuộc bài viết nào cả");

            if (findGroup != null && post.GroupId != findGroup.Id)
                throw new AppException("Bình luận này không thuộc nhóm bạn báo cáo");

            if (comment.UserId == userId) throw new AppException("Không thể tự báo cáo bình luận của chính mình");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var newReport = new Domain.Entity.System.Report()
            {
                Reason = request.Reason,
                ReporterId = userId,
                ReportType = ReportType.COMMENT,
                Status = ReportStatus.PENDING,
                TargetCommentId = comment.Id,
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
                Message = "Báo cáo bình luận thành công và đã được gửi đi cho người quản trị hệ thống",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
