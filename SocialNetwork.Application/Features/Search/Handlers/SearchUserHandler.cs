﻿
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.DTOs.Search;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class SearchUserHandler : IRequestHandler<SearchUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public SearchUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(SearchUserQuery request, CancellationToken cancellationToken)
        {
            var (users, totalCount) = await _unitOfWork.UserRepository.GetAllUsersContainsKeyAsync(request.Query.ToLower(), request.Page, request.Size);

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);
            var myFriendsIds = myFriends.Select(f => f.UserId == userId ? f.FriendId : f.UserId).ToHashSet();

            var response = new List<SearchUserSuggestResponse>();

            foreach (var user in users)
            {
                var mapUser = ApplicationMapper.MapToUser(user);
                if (user.Id == userId)
                {
                    var userItem = new SearchUserSuggestResponse()
                    {
                        User = mapUser,
                    };
                    response.Add(userItem);
                    continue;
                };

                var friendShip = await _unitOfWork.FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(userId, user.Id, FriendShipStatus.ACCEPTED);
                var userFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(user.Id, FriendShipStatus.ACCEPTED);
                var mutualFriendsCount = userFriends.Count(f => myFriendsIds.Contains(f.UserId == user.Id ? f.FriendId : f.UserId));
                var top3MutualFriends = userFriends.Where(f => myFriendsIds.Contains(f.UserId == user.Id ? f.FriendId : f.UserId)).Select(f => f.UserId == user.Id ? f.Friend : f.User).Take(3);
                var follower = await _unitOfWork.FollowRepository.GetFollowByFollowerIdAndFolloweeIdAsync(userId, user.Id);

                var item = new SearchUserSuggestResponse()
                {
                    User = mapUser,
                    CountMutualFriends = mutualFriendsCount,
                    IsFollow = follower != null,
                    IsFriend = friendShip != null,
                    MutualFriends = top3MutualFriends.Select(u => ApplicationMapper.MapToFriend(u)).ToList(),
                };

                response.Add(item);
            }

            var countUsers = response.Count;

            return new PaginationResponse<List<SearchUserSuggestResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = $"Tìm thấy {totalCount} kết quả cho '{request.Query}'",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Page * request.Size <= totalCount
                }
            };
        }
    }
}
