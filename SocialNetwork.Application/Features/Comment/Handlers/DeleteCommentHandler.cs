

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Comment.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class DeleteCommentHandler : IRequestHandler<DeleteCommentCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public DeleteCommentHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(request.CommentId)
                ?? throw new NotFoundException("Không tìm thấy bình luận");

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            if(comment.Post.Group != null && comment.Post.GroupId.HasValue)
            {
                var groupMember = await _unitOfWork.GroupMemberRepository
                    .GetGroupMemberByGroupIdAndUserId(comment.Post.GroupId.Value, userId);

                if(groupMember != null && groupMember.Role != MemberRole.ADMIN)
                {
                    if (comment.UserId != userId && comment.Post.UserId != userId)
                        throw new AppException("Bạn không thể xóa bình luận này");
                }

            } else if (comment.UserId != userId && comment.Post.UserId != userId)
                throw new AppException("Bạn không thể xóa bình luận này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var replies = await _unitOfWork.CommentRepository.GetAllRepliesByCommentIdAsync(comment.Id);
            foreach (var commentItem in replies)
            {
                commentItem.ParentCommentId = comment.ParentCommentId;
            }

            _unitOfWork.CommentRepository.DeleteComment(comment);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xóa bình luận thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
