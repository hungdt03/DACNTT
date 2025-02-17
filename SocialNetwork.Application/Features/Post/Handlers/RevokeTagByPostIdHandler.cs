

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class RevokeTagByPostIdHandler : IRequestHandler<RevokeTagByPostIdCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RevokeTagByPostIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(RevokeTagByPostIdCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var tag = await _unitOfWork.TagRepository
                .GetTagByPostIdAndUserIdAsync(request.PostId, userId)
                ?? throw new NotFoundException("Không tìm thấy thẻ của bạn trên bài viết");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.TagRepository.DeleteTag(tag);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Gỡ thẻ thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
