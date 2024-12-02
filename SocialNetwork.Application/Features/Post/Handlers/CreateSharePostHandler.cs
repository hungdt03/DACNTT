

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class CreateSharePostHandler : IRequestHandler<CreateSharePostCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public CreateSharePostHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(CreateSharePostCommand request, CancellationToken cancellationToken)
        {
            var originalPost = await _unitOfWork.PostRepository.GetPostByIdAsync(request.OriginalPostId)
                ?? throw new AppException("Không tìm thấy bài viết gốc");

            if(request.OriginalPostId != request.PostId)
            {
                var post = await _unitOfWork.PostRepository.GetPostByIdAsync(request.PostId)
                ?? throw new AppException("Không tìm thấy bài viết chia sẻ");
            }
            

            var sharePost = new SocialNetwork.Domain.Entity.Post
            {
                Content = request.Content,
                PostType = PostType.SHARE_POST,
                OriginalPostId = request.OriginalPostId,
                SharePostId = request.PostId,
                Privacy = request.Privacy,
                UserId = _contextAccessor.HttpContext.User.GetUserId(),
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.PostRepository.CreatePostAsync(sharePost);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse
            {
                IsSuccess = true,
                Message = "Chia sẻ bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
