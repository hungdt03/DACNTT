

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Report.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Report.Handlers
{
    public class RemoveCommentByGroupAdminHandler : IRequestHandler<RemoveCommentByGroupAdminCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RemoveCommentByGroupAdminHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(RemoveCommentByGroupAdminCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var report = await _unitOfWork
                .ReportRepository.GetReportByIdAsync(request.ReportId)
                    ?? throw new AppException("Báo cáo này không tồn tại hoặc đã được xử lí");

            if (!report.GroupId.HasValue) throw new AppException("Báo cáo này do quản trị hệ thống xử lí");

            var groupMember = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(report.GroupId.Value, userId);

            if (groupMember == null || groupMember.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không đủ thẩm quyền để gỡ bình luận này");

            var comment = await _unitOfWork.CommentRepository
                .GetCommentByIdAsync(report.TargetCommentId.Value)
                    ?? throw new NotFoundException("ID bình luận không hợp lệ");

            if (comment.Post.GroupId != report.GroupId.Value)
                throw new AppException("Bạn không đủ thẩm quyền để gỡ bình luận này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var replies = await _unitOfWork.CommentRepository.GetAllRepliesByCommentIdAsync(comment.Id);
            foreach (var commentItem in replies)
            {
                commentItem.ParentCommentId = comment.ParentCommentId;
            }
            _unitOfWork.CommentRepository.DeleteComment(comment);
            _unitOfWork.ReportRepository.RemoveReport(report);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã gỡ bình luận này",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
