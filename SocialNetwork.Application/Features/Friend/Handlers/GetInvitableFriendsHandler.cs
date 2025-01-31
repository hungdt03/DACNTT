using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Friend.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Friend.Handlers
{
    public class GetInvitableFriendsHandler : IRequestHandler<GetInvitableFriendsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetInvitableFriendsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetInvitableFriendsQuery request, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.GroupRepository.GetGroupByIdAsync(request.GroupId)
               ?? throw new NotFoundException("Nhóm không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);
            var response = new List<InvitableFriendResponse>();
           
            foreach (var friend in myFriends)
            {
                var friendItem = friend.FriendId == userId ? friend.User : friend.Friend;
                var resource = ApplicationMapper.MapToFriend(friendItem);
                
                var existedInvitation = await _unitOfWork.GroupInvitationRepository.GetGroupInvitationByInviteeIdAndGroupIdAsync(friendItem.Id, request.GroupId);
                var isMember = group.Members.Any(m => m.UserId == friendItem.Id);

                response.Add(new InvitableFriendResponse()
                {
                    Friend = resource,
                    IsMember = isMember,
                    HaveInvited = existedInvitation != null,
                });
            }

            return new DataResponse<List<InvitableFriendResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bạn bè thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
