using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Friend.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Friend.Handlers
{
    public class GetAllFriendsHandler : IRequestHandler<GetAllFriendsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllFriendsHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllFriendsQuery request, CancellationToken cancellationToken)
        {
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(request.UserId, FriendShipStatus.ACCEPTED);
            var response = new List<FriendResponse>();

            foreach (var friend in myFriends)
            {
                var friendItem = friend.FriendId == request.UserId ? friend.User : friend.Friend;
                var resource = ApplicationMapper.MapToFriend(friendItem);
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
