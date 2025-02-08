

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Comment.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class DeleteCommentHandler : IRequestHandler<DeleteCommentCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteCommentHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(request.CommentId)
                ?? throw new NotFoundException("Không tìm thấy bình luận");

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
