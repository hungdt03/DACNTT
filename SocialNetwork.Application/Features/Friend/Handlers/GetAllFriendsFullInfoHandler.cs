
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Friend.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Friend.Handlers
{
    public class GetAllFriendsFullInfoHandler : IRequestHandler<GetAllFriendsFullInfoQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllFriendsFullInfoHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllFriendsFullInfoQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var friends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(request.UserId, FriendShipStatus.ACCEPTED);
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);
            var response = new List<FriendResponse>();

            var myFriendsIds = myFriends.Select(f => f.FriendId).ToHashSet();
            foreach (var friend in friends)
            {
                var friendItem = friend.FriendId == request.UserId ? friend.User : friend.Friend;

                //if (friendItem.Id == userId) continue;

                var friendsOfTemp = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(friendItem.Id, FriendShipStatus.ACCEPTED);
                var mutualFriendsCount = friendsOfTemp.Count(f => myFriendsIds.Contains(f.UserId == friendItem.Id ? f.FriendId : friendItem.Id));

                var resource = ApplicationMapper.MapToFriend(friendItem);
                resource.MutualFriends = mutualFriendsCount;
                response.Add(resource);
            }

            return new DataResponse<List<FriendResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bạn bè thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };

        }
    }
}
