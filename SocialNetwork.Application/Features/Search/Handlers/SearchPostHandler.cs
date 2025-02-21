
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class SearchPostHandler : IRequestHandler<SearchPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public SearchPostHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(SearchPostQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (posts, totalCount) = await _unitOfWork.PostRepository.GetAllPostsContainsKey(request.Query.ToLower(), request.Page, request.Size, request.SortOrder, request.ContentType, request.FromDate, request.ToDate);

            var response = new List<PostResponse>();
            foreach (var item in posts)
            {
                var mapPost = ApplicationMapper.MapToPost(item);

                if (item.UserId != userId)
                {
                    var friendShip = await _unitOfWork.FriendShipRepository
                        .GetFriendShipByUserIdAndFriendIdAsync(item.UserId, userId);

                    if ((item.Privacy == PrivacyConstant.PUBLIC || item.Privacy == PrivacyConstant.GROUP_PUBLIC || item.Privacy == PrivacyConstant.GROUP_PRIVATE) && (friendShip == null || !friendShip.IsConnect))
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

                response.Add(mapPost);
            }
            var countPosts = response.Count;

            return new PaginationResponse<List<PostResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = $"Tìm thấy {countPosts} kết quả cho '{request.Query}'",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Page * request.Size <= totalCount
                }
            };
        }
    }
}
