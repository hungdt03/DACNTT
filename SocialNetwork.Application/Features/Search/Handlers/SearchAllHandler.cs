
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
    public class SearchAllHandler : IRequestHandler<SearchAllQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public SearchAllHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(SearchAllQuery request, CancellationToken cancellationToken)
        {
            var (users, userTotalCount) = await _unitOfWork.UserRepository.GetAllUsersContainsKeyAsync(request.Query.ToLower(), 1, 6);
            var (groups, groupTotalCount) = await _unitOfWork.GroupRepository.GetAllGroupsContainsKey(request.Query.ToLower(), 1, 6);
            var (posts, postTotalCount) = await _unitOfWork.PostRepository.GetAllPostsContainsKey(request.Query.ToLower(), 1, 6);

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);
            var myFriendsIds = myFriends.Select(f => f.UserId == userId ? f.FriendId : f.UserId).ToHashSet();
            
            var groupResponse = new List<SearchGroupSuggestResponse>();

            foreach (var group in groups)
            {
                var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(group.Id, userId);

                if (groupMember == null && group.IsHidden && group.Privacy == GroupPrivacy.PRIVATE) continue;

                var countMemberFriends = group.Members.Where(grm => myFriendsIds.Contains(grm.UserId)).Count();
                var mapGroup = ApplicationMapper.MapToGroup(group);
                var members = group.Members.Where(grm => myFriendsIds.Contains(grm.UserId)).Take(3);

                var item = new SearchGroupSuggestResponse()
                {
                    TotalMembers = group.Members.Count,
                    CountFriendMembers = countMemberFriends,
                    FriendMembers = members.Select(m => ApplicationMapper.MapToUser(m.User)).ToList(),
                    IsMember = groupMember != null,
                    Group = mapGroup,
                };

                groupResponse.Add(item);
            }

            var userResponse = new List<SearchUserSuggestResponse>();

            foreach (var user in users)
            {
                if (user.Id == userId) continue;
                var mapUser = ApplicationMapper.MapToUser(user);

                var friendShip = await _unitOfWork.FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(userId, user.Id, FriendShipStatus.ACCEPTED);
                var userFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(user.Id, FriendShipStatus.ACCEPTED);
                var mutualFriendsCount = userFriends.Count(f => myFriendsIds.Contains(f.UserId == user.Id ? f.FriendId : user.Id));
                var top3MutualFriends = userFriends.Where(f => myFriendsIds.Contains(f.UserId == user.Id ? f.FriendId : user.Id)).Select(f => f.UserId == user.Id ? f.Friend : user).Take(3);
                var follower = await _unitOfWork.FollowRepository.GetFollowByFollowerIdAndFolloweeIdAsync(userId, user.Id);

                var item = new SearchUserSuggestResponse()
                {
                    User = mapUser,
                    CountMutualFriends = mutualFriendsCount,
                    IsFollow = follower != null,
                    IsFriend = friendShip != null,
                    MutualFriends = top3MutualFriends.Select(u => ApplicationMapper.MapToFriend(u)).ToList(),
                };

                userResponse.Add(item);
            }

            var countResult = groupResponse.Count + userResponse.Count + postTotalCount;

            return new DataResponse<SearchAllResponse>
            {
                Data = new SearchAllResponse ()
                {
                    Groups = groupResponse,
                    Users = userResponse,
                    Posts = posts.Select(ApplicationMapper.MapToPost).ToList(),
                },
                IsSuccess = true,
                Message = $"Tìm thấy {countResult} kết quả cho '{request.Query}'",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
