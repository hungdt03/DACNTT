
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.SavedPost.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.SavedPost.Handlers
{
    public class RemoveSavedPostHandler : IRequestHandler<RemoveSavedPostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RemoveSavedPostHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(RemoveSavedPostCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var savedPost = await _unitOfWork.SavedPostRepository
                .GetSavedPostByPostIdAndUserId(request.PostId, userId)
                    ?? throw new NotFoundException("Bài viết chưa được lưu");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.SavedPostRepository.RemoveSavedPost(savedPost); 
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Gỡ bài viết khỏi danh sách đã lưu thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
