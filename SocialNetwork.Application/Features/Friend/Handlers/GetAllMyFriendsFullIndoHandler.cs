
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
    public class GetAllMyFriendsFullIndoHandler : IRequestHandler<GetAllMyFriendsFullInfoQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllMyFriendsFullIndoHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllMyFriendsFullInfoQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);
            var myFriendsIds = myFriends.Select(f => f.FriendId != userId ? f.FriendId : f.UserId).ToHashSet();

            var takeMyFriends = myFriends.Skip((request.Page - 1) * request.Size).Take(request.Size);
            var response = new List<FriendResponse>();
            foreach (var friend in takeMyFriends)
            {
                var friendItem = friend.FriendId == userId ? friend.User : friend.Friend;
                var resource = ApplicationMapper.MapToFriend(friendItem);

                var friendsOfTemp = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(friendItem.Id, FriendShipStatus.ACCEPTED);
                var mutualFriendsCount = friendsOfTemp.Count(f => myFriendsIds.Contains(f.UserId == friendItem.Id ? f.FriendId : f.UserId));
                resource.MutualFriends = mutualFriendsCount;
                response.Add(resource);
            }

            return new PaginationResponse<List<FriendResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bạn bè thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Page * request.Size < myFriendsIds.Count,
                }
            };
        }
    }
}
