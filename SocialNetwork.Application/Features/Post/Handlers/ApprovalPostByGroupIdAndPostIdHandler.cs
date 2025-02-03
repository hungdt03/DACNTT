
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
    public class ApprovalPostByGroupIdAndPostIdHandler : IRequestHandler<ApprovalPostByGroupIdAndPostIdCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ApprovalPostByGroupIdAndPostIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor  contextAccessor)
        {
              _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ApprovalPostByGroupIdAndPostIdCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Bài viết không tồn tại");

            if (!post.IsGroupPost) throw new AppException("Đây không phải bài viết của nhóm");

            if (post.GroupId.Value != request.GroupId)
                throw new AppException("Bài viết không thuộc nhóm bạn cung cấp");

            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(post.GroupId.Value, userId);

            if (groupMember == null || groupMember.Role == MemberRole.MEMBER)
                throw new AppException("Bạn không có quyền phê duyệt bài viết");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            post.ApprovalStatus = ApprovalStatus.APPROVED;
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Phê duyệt bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
