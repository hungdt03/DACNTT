
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
    public class GetUserFriendFullInfoHandler : IRequestHandler<GetAllUserFriendsFullInfoQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetUserFriendFullInfoHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllUserFriendsFullInfoQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (userFriends, totalCount) = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(request.UserId, request.Page, request.Size, FriendShipStatus.ACCEPTED);
           
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);
            var myFriendsIds = myFriends.Select(f => f.FriendId != userId ? f.FriendId : f.UserId).ToHashSet();
            
            var response = new List<FriendResponse>();
            foreach (var friend in userFriends)
            {
                var friendItem = friend.FriendId == request.UserId ? friend.User : friend.Friend;
                var resource = ApplicationMapper.MapToFriend(friendItem);

                if(friendItem.Id != userId)
                {
                    var block = await _unitOfWork.BlockListRepository
                       .GetBlockListByUserIdAndUserIdAsync(userId, friendItem.Id);
                    if (block != null) continue;

                    var friendsOfTemp = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(friendItem.Id, FriendShipStatus.ACCEPTED);
                    var mutualFriendsCount = friendsOfTemp.Count(f =>  myFriendsIds.Contains(f.UserId == friendItem.Id ? f.FriendId : f.UserId));
                    resource.MutualFriends = mutualFriendsCount;
                }
               
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
                    HasMore = request.Page * request.Size < totalCount,
                }
            };

        }
    }
}
