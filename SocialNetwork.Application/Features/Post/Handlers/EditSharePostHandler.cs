

using MediatR;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class EditSharePostHandler : IRequestHandler<EditSharePostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public EditSharePostHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(EditSharePostCommand request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Không tìm thấy bài viết chia sẻ");

            post.Content = request.Post.Content;
            post.Privacy = request.Post.Privacy;

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse
            {
                IsSuccess = true,
                Message = "Cập nhật bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
