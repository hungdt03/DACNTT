
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Search.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class RemoveSearchHistoryHandler : IRequestHandler<RemoveSearchHistoryCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RemoveSearchHistoryHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(RemoveSearchHistoryCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var searchHistory = await _unitOfWork.SearchRepository
                .GetSearchHistoryByUserIdAndId(userId, request.SearchHistoryId)
                    ?? throw new NotFoundException("ID từ khóa tìm kiếm không tồn tại");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.SearchRepository.RemoveSearchHistory(searchHistory);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xóa từ khóa tìm kiếm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
