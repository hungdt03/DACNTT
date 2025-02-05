

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Search.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class AddSearchTextPlainHandler : IRequestHandler<AddSearchTextPlainCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public AddSearchTextPlainHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(AddSearchTextPlainCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var existedSearchHistory = await _unitOfWork
                .SearchRepository.GetSearchHistoryByTextAndUserId(request.Text, userId);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            
            if (existedSearchHistory != null)
            {
                existedSearchHistory.DateCreated = DateTimeOffset.UtcNow;
            } else
            {
                var searchHistory = new SearchHistory()
                {
                    SearchText = request.Text,
                    UserId = userId
                };

                await _unitOfWork.SearchRepository.CreateSearchHistoryAsync(searchHistory);
            }
           
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Thêm vào lịch sử tìm kiếm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
