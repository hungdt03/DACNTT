
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class RejectPostByGroupIdAndPostIdHandler : IRequestHandler<RejectPostByGroupIdAndPostIdCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public RejectPostByGroupIdAndPostIdHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(RejectPostByGroupIdAndPostIdCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Bài viết không tồn tại");

            if (!post.IsGroupPost) throw new AppException("Đây không phải bài viết của nhóm");

            if (post.GroupId.Value != request.GroupId)
                throw new AppException("Bài viết không thuộc nhóm bạn cung cấp");

            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            if (groupMember == null || groupMember.Role == MemberRole.MEMBER)
                throw new AppException("Bạn không có quyền từ chối phê duyệt bài viết");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            post.ApprovalStatus = ApprovalStatus.REJECTED;
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Từ chối phê duyệt bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
