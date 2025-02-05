
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Search.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class RemoveAllSearchHistoryHandler : IRequestHandler<RemoveAllSearchHistoryCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RemoveAllSearchHistoryHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(RemoveAllSearchHistoryCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var searchHistories = await _unitOfWork.SearchRepository.GetAllSearchHistoryByUserIdAsync(userId);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.SearchRepository.RemoveRange(searchHistories);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xóa tất cả lịch sử tìm kiếm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
