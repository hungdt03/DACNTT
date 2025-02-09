
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
    public class RemovePostByGroupAdminHandler : IRequestHandler<RemovePostByGroupAdminCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RemovePostByGroupAdminHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(RemovePostByGroupAdminCommand request, CancellationToken cancellationToken)
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

            var post = await _unitOfWork.PostRepository
                .GetPostByIdAsync(report.TargetPostId.Value)
                    ?? throw new NotFoundException("ID bài viết không hợp lệ");

            if (post.GroupId != report.GroupId.Value)
                throw new AppException("Bạn không đủ thẩm quyền để gỡ bài viết này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var reactions = await _unitOfWork.ReactionRepository.GetAllReactionsByPostIdAsync(post.Id);
            var comments = await _unitOfWork.CommentRepository.GetAllCommentsByPostIdAsync(post.Id);
            var sharePosts = await _unitOfWork.PostRepository.GetAllSharePostsByOriginalPostId(post.Id);

            _unitOfWork.ReactionRepository.RemoveRange(reactions);

            sharePosts.ForEach(p =>
            {
                if (post.PostType == PostType.ORIGINAL_POST)
                {
                    if (p.SharePostId == p.OriginalPostId)
                    {
                        p.SharePostId = null;
                    }

                    p.OriginalPostId = null;
                }
                else
                {
                    p.SharePostId = null;
                }

            });

            _unitOfWork.CommentRepository.RemoveRange(comments);
            _unitOfWork.PostRepository.DeletePost(post);
            _unitOfWork.ReportRepository.RemoveReport(report);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã gỡ bài viết này",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
