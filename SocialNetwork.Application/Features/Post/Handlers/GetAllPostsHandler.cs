
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetAllPostsHandler : IRequestHandler<GetAllPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IHttpContextAccessor httpContextAccessor;

        public GetAllPostsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
        {
            this.unitOfWork = unitOfWork;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllPostQuery request, CancellationToken cancellationToken)
        {
            var userId = httpContextAccessor.HttpContext.User.GetUserId();
            var allPosts = await unitOfWork.PostRepository.GetAllPostsAsync();

            var filteredPosts = new List<Domain.Entity.PostInfo.Post>();
            foreach (var post in allPosts)
            {
                bool isMe = post.UserId == userId;
              
                if (!isMe)
                {
                    var friendShip = await unitOfWork.FriendShipRepository
                           .GetFriendShipByUserIdAndFriendIdAsync(post.UserId, userId, FriendShipStatus.ACCEPTED);

                    if (post.Privacy.Equals(PrivacyConstant.PUBLIC))
                    {
                        if(friendShip == null)
                        {
                            var isFollow = await unitOfWork.FollowRepository.IsFollowUserByFollowerIdAsync(post.UserId, userId);
                            if (isFollow)
                                filteredPosts.Add(post);
                        } else
                        {
                            filteredPosts.Add(post);
                        }
                       
                    }
                    else if (post.Privacy.Equals(PrivacyConstant.FRIENDS))
                    {
                       
                        if (friendShip != null)
                        {
                            filteredPosts.Add(post);
                        }
                    } else if(post.IsGroupPost && post.Group != null && post.GroupId.HasValue)
                    {
                        var member = await unitOfWork.GroupMemberRepository
                            .GetGroupMemberByGroupIdAndUserId(post.GroupId.Value, userId);

                        if (member == null || post.ApprovalStatus != ApprovalStatus.APPROVED) continue;

                        filteredPosts.Add(post);
                    }
                }
                else
                {
                    filteredPosts.Add(post);
                }
            }

            // Phân trang
            var takePosts = filteredPosts
                .OrderByDescending(p => p.DateCreated)
                .Skip((request.Page - 1) * request.Size)
                .Take(request.Size)
                .ToList();

            var response = new List<PostResponse>();
            foreach (var item in takePosts)
            {
                var check = false;
                if(item.UserId != userId)
                {
                    var checkIsBlock = await unitOfWork.BlockListRepository
                        .CheckIsBlockAsync(item.UserId, userId);

                    if (checkIsBlock) continue;

                    var friendShip = await unitOfWork.FriendShipRepository
                        .GetFriendShipByUserIdAndFriendIdAsync(item.UserId, userId);

                    if((item.Privacy == PrivacyConstant.PUBLIC || item.Privacy == PrivacyConstant.GROUP_PUBLIC || item.Privacy == PrivacyConstant.GROUP_PRIVATE) && (friendShip == null || !friendShip.IsConnect))
                    {
                        check = true;
                    }
                }

                var mapPost = ApplicationMapper.MapToPost(item);

                if (item.PostType == PostType.ORIGINAL_POST)
                {
                    var shares = await unitOfWork.PostRepository.CountSharesByPostIdAsync(item.Id);
                    mapPost.Shares = shares;
                };

                if(check)
                {
                    mapPost.User.IsShowStatus = false;
                    mapPost.User.IsOnline = false;
                }

                if(item.OriginalPost != null)
                {
                    // Story
                    var originalPostStory = await unitOfWork.StoryRepository
                            .IsUserHaveStoryAsync(item.OriginalPost.UserId);
                    mapPost.OriginalPost.User.HaveStory = originalPostStory;
                }

                // Story
                var haveStory = await unitOfWork.StoryRepository
                        .IsUserHaveStoryAsync(item.UserId);
                mapPost.User.HaveStory = haveStory;

                // Saved Post
                var savedPost = await unitOfWork.SavedPostRepository
                    .GetSavedPostByPostIdAndUserId(item.Id, userId);
                mapPost.IsSaved = savedPost != null;

                // Group
                if(item.IsGroupPost && item.Group != null)
                {
                    var groupMember = await unitOfWork.GroupMemberRepository
                        .GetGroupMemberByGroupIdAndUserId(item.Group.Id, userId);

                    if (groupMember != null)
                    {
                        mapPost.Group.IsMine = groupMember.Role == MemberRole.ADMIN;
                        mapPost.Group.IsMember = true;
                        mapPost.Group.IsModerator = groupMember.Role == MemberRole.MODERATOR;
                    }
                }
                response.Add(mapPost);
            }

            return new PaginationResponse<List<PostResponse>>
            {
                Data = response,
                Pagination = new Pagination
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Page * request.Size < filteredPosts.Count,
                },
                IsSuccess = true,
                Message = "Lấy danh sách bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
