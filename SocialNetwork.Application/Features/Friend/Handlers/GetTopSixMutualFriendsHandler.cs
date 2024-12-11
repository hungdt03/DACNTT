﻿
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Friend.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Friend.Handlers
{
    public class GetTopSixMutualFriendsHandler : IRequestHandler<GetTopSixMutualFriendsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetTopSixMutualFriendsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetTopSixMutualFriendsQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var userFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(request.UserId);
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId);

            var myFriendsIds = myFriends.Select(f => f.FriendId).ToHashSet();
            var response = new List<FriendResponse>();

            foreach (var friend in userFriends)
            {
                var friendsOfTemp = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(friend.FriendId);
                var mutualFriendsCount = friendsOfTemp.Count(f => myFriendsIds.Contains(f.FriendId));

                var resource = ApplicationMapper.MapToFriend(friend.User);
                resource.MutualFriends = mutualFriendsCount;
                response.Add(resource);
            }

            var topSixFriends = response
                .OrderByDescending(r => r.MutualFriends)
                .Take(6)
                .ToList();

            return new DataResponse<List<FriendResponse>>
            {
                Data = topSixFriends,
                IsSuccess = true,
                Message = "Lấy danh sách bạn bè thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
