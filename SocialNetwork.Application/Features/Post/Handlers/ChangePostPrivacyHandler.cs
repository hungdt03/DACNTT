
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
    public class ChangePostPrivacyHandler : IRequestHandler<ChangePostPrivacyCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ChangePostPrivacyHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ChangePostPrivacyCommand request, CancellationToken cancellationToken)
        {
            var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new NotFoundException("Bài viết không tồn tại");

            if (post.IsGroupPost) throw new AppException("Không thể thay đổi quyền riêng tư của bài viết nhóm");

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            if (post.UserId != userId)
                throw new AppException("Bạn không thể thay đổi quyền riêng tư bài viết của người khác");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            post.Privacy = request.PrivacyType;
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
            
        }
    }
}
