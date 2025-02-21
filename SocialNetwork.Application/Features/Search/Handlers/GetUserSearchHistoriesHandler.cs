

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity.System;

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

            var response = new List<SearchHistoryResponse>();
            foreach (var searchHistory in searchHistories)
            {
                var searchHistoryItem = ApplicationMapper.MapToSearch(searchHistory);

                if(searchHistory.SearchUserId != null)
                {
                    if(searchHistory.SearchUserId != userId)
                    {
                        var block = await _unitOfWork.BlockListRepository
                            .GetBlockListByUserIdAndUserIdAsync(searchHistory.SearchUserId, userId);

                        if (block != null) continue;

                        var friendShip = await _unitOfWork.FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(userId, searchHistory.SearchUserId);
                        if (friendShip == null || !friendShip.IsConnect)
                        {
                            searchHistoryItem.User.IsShowStatus = false;
                            searchHistoryItem.User.IsOnline = false;
                        }
                    }

                    var haveStory = await _unitOfWork.StoryRepository
                        .IsUserHaveStoryAsync(searchHistory.SearchUserId);

                    searchHistoryItem.User.HaveStory = haveStory;
                }

                response.Add(searchHistoryItem);
            }

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
