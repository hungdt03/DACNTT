

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs.Search;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class GetAllSearchSuggestHandler : IRequestHandler<GetAllSearchSuggestQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllSearchSuggestHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllSearchSuggestQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (users, userTptalCount) = await _unitOfWork.UserRepository.GetAllUsersContainsKeyAsync(request.Query, 1, 6);
            var (groups, groupTotalCount) = await _unitOfWork.GroupRepository.GetAllGroupsContainsKey(request.Query, 1, 6);

            var searchUsers = new List<SearchUserSuggestResponse>();
            var searchGroups = new List<SearchGroupSuggestResponse>();

            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);
            var myFriendsIds = myFriends.Select(f => f.UserId == userId ? f.FriendId : f.UserId).ToHashSet();

            foreach ( var user in users )
            {
                if (user.Id == userId) continue;
                var mapUser = ApplicationMapper.MapToUser(user);

                var friendShip = await _unitOfWork.FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(userId, user.Id, FriendShipStatus.ACCEPTED);
                var userFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(user.Id, FriendShipStatus.ACCEPTED);
                var mutualFriendsCount = userFriends.Count(f => myFriendsIds.Contains(f.UserId == user.Id ? f.FriendId : f.UserId));

                if (friendShip == null)
                {
                    var searchUserItem = new SearchUserSuggestResponse()
                    {
                        IsFriend = false,
                        CountMutualFriends = mutualFriendsCount,
                        PlainText = true,
                        User = mapUser,
                    };

                    searchUsers.Add(searchUserItem);
                } else
                {
                   
                    var searchUserItem = new SearchUserSuggestResponse()
                    {
                        IsFriend = true,
                        CountMutualFriends = mutualFriendsCount,
                        PlainText = false,
                        User = mapUser,
                    };

                    searchUsers.Add(searchUserItem);
                }
            }

            foreach(var group in groups)
            {
                var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(group.Id, userId);

                if (groupMember == null && group.IsHidden && group.Privacy == GroupPrivacy.PRIVATE) continue;
                
                var countMemberFriends = group.Members.Where(grm => myFriendsIds.Contains(grm.UserId)).Count();
                var mapGroup = ApplicationMapper.MapToGroup(group);
                if (groupMember == null)
                {
                    var searchGroupItem = new SearchGroupSuggestResponse()
                    {
                        TotalMembers = group.Members.Count,
                        CountFriendMembers = countMemberFriends,
                        Group = mapGroup,
                        IsMember = false,
                        PlainText = countMemberFriends == 0
                    };

                    searchGroups.Add(searchGroupItem);

                } else
                {
                    var searchGroupItem = new SearchGroupSuggestResponse()
                    {
                        TotalMembers = group.Members.Count,
                        CountFriendMembers = countMemberFriends,
                        Group = mapGroup,
                        PlainText = false,
                        IsMember = true
                    };

                    searchGroups.Add(searchGroupItem);
                }
            }

            var response = new SearchAllSuggestResponse();
            response.Users = searchUsers;
            response.Groups = searchGroups;

            return new DataResponse<SearchAllSuggestResponse>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy các thông tin gợi ý tìm kiếm thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
