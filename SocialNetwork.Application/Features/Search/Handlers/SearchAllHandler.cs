
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
using SocialNetwork.Domain.Entity.PostInfo;
using SocialNetwork.Domain.Entity.UserInfo;

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
                var mapUser = ApplicationMapper.MapToUser(user);
                if (user.Id != userId)
                {
                    var blockUser = await _unitOfWork.BlockListRepository
                        .GetBlockListByUserIdAndUserIdAsync(user.Id, userId);
                    if (blockUser != null) continue;
                }

                var haveStory = await _unitOfWork.StoryRepository
                   .IsUserHaveStoryAsync(user.Id);
                mapUser.HaveStory = haveStory;

                if (user.Id == userId)
                {
                    var userItem = new SearchUserSuggestResponse()
                    {
                        User = mapUser,
                    };
                    userResponse.Add(userItem);
                    continue;
                };
               
                var userFriends = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(user.Id, FriendShipStatus.ACCEPTED);
                var mutualFriendsCount = userFriends.Count(f => myFriendsIds.Contains(f.UserId == user.Id ? f.FriendId : f.UserId));
                var top3MutualFriends = userFriends.Where(f => myFriendsIds.Contains(f.UserId == user.Id ? f.FriendId : f.UserId)).Select(f => f.UserId == user.Id ? f.Friend : f.User).Take(3);
                var follower = await _unitOfWork.FollowRepository.GetFollowByFollowerIdAndFolloweeIdAsync(userId, user.Id);

                var friendShip = await _unitOfWork.FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(userId, user.Id);

                if (friendShip == null || !friendShip.IsConnect)
                {
                    mapUser.IsShowStatus = false;
                    mapUser.IsOnline = false;
                }

                var item = new SearchUserSuggestResponse()
                {
                    User = mapUser,
                    CountMutualFriends = mutualFriendsCount,
                    IsFollow = follower != null,
                    IsFriend = friendShip != null && friendShip.Status == FriendShipStatus.ACCEPTED,
                    MutualFriends = top3MutualFriends.Select(u => ApplicationMapper.MapToFriend(u)).ToList(),
                };

                userResponse.Add(item);
            }

            var postResponse = new List<PostResponse>();
            foreach (var item in posts)
            {
                var mapPost = ApplicationMapper.MapToPost(item);

                if (item.UserId != userId)
                {
                    var friendShip = await _unitOfWork.FriendShipRepository
                        .GetFriendShipByUserIdAndFriendIdAsync(item.UserId, userId);

                    if (friendShip == null || !friendShip.IsConnect)
                    {
                        mapPost.User.IsShowStatus = false;
                        mapPost.User.IsOnline = false;
                    } else
                    {
                        // Story
                        var haveStory = await _unitOfWork.StoryRepository
                                .IsUserHaveStoryAsync(item.UserId);
                        mapPost.User.HaveStory = haveStory;
                    }

                } else
                {
                    // Story
                    var haveStory = await _unitOfWork.StoryRepository
                            .IsUserHaveStoryAsync(item.UserId);
                    mapPost.User.HaveStory = haveStory;
                }

                if (item.PostType == PostType.ORIGINAL_POST)
                {
                    var shares = await _unitOfWork.PostRepository.CountSharesByPostIdAsync(item.Id);
                    mapPost.Shares = shares;
                };


                // Saved Post
                var savedPost = await _unitOfWork.SavedPostRepository
                    .GetSavedPostByPostIdAndUserId(item.Id, userId);
                mapPost.IsSaved = savedPost != null;

                // Group
                if (item.IsGroupPost && item.Group != null)
                {
                    var groupMember = await _unitOfWork.GroupMemberRepository
                        .GetGroupMemberByGroupIdAndUserId(item.Group.Id, userId);

                    if (groupMember != null)
                    {
                        mapPost.Group.IsMine = groupMember.Role == MemberRole.ADMIN;
                        mapPost.Group.IsMember = true;
                        mapPost.Group.IsModerator = groupMember.Role == MemberRole.MODERATOR;
                    }
                }
                postResponse.Add(mapPost);
            }

            var countResult = groupResponse.Count + userResponse.Count + postResponse.Count;

            return new DataResponse<SearchAllResponse>
            {
                Data = new SearchAllResponse ()
                {
                    Groups = groupResponse,
                    Users = userResponse,
                    Posts = postResponse,
                },
                IsSuccess = true,
                Message = $"Tìm thấy {countResult} kết quả cho '{request.Query}'",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
