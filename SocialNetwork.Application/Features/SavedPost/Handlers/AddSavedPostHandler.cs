

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.SavedPost.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.SavedPost.Handlers
{
    public class AddSavedPostHandler : IRequestHandler<AddSavedPostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public AddSavedPostHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(AddSavedPostCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var post = await _unitOfWork.PostRepository
                .GetPostByIdAsync(request.PostId)
                    ?? throw new NotFoundException("Bài viết không tồn tại");

            var existedSavedPost = await _unitOfWork.SavedPostRepository
                .GetSavedPostByPostIdAndUserId(post.Id, userId);

            if (existedSavedPost != null) throw new AppException("Bài viết đã được lưu trước đó");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            var savedPost = new Domain.Entity.UserInfo.SavedPost()
            {
                UserId = userId,
                PostId = request.PostId,
            };

            await _unitOfWork.SavedPostRepository.CreateNewSavedPostAsync(savedPost);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Lưu bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
