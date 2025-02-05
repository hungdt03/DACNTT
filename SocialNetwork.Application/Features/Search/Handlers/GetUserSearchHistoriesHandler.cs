

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class GetUserSearchHistoriesHandler : IRequestHandler<GetUserSearchHistoriesQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetUserSearchHistoriesHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(GetUserSearchHistoriesQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var (searchHistories, totalCount) = await _unitOfWork.SearchRepository.GetAllSearchHistoryByUserIdAsync(userId, request.Page, request.Size);

            var response = searchHistories.Select(ApplicationMapper.MapToSearch).ToList();

            return new PaginationResponse<List<SearchHistoryResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy lịch sử tìm kiếm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size
                }
            };
        }
    }
}
