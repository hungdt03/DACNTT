
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Story.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.StoryInfo;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class GetAllStoriesHandler : IRequestHandler<GetAllStoriesQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllStoriesHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(GetAllStoriesQuery request, CancellationToken cancellationToken)
        {
            var stories = await _unitOfWork.StoryRepository.GetAllStoriesAsync();
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var groupedStories = stories
                .Select(ApplicationMapper.MapToStory)
                .ToList()
                .GroupBy(x => x.User.Id);

            var response = new List<UserStoryResponse>();
            foreach (var group in groupedStories)
            {
                var userStories = group.ToList();
                if (group.Key == userId)
                {
                    bool haveAnyViewers = false;
                    foreach (var story in userStories)
                    {                    
                        haveAnyViewers = await _unitOfWork.ViewerRepository.IsAnViewersByStoryId(story.Id);
                        if (!haveAnyViewers) break;
                    }

                    response.Add(new UserStoryResponse
                    {
                        HaveSeen = haveAnyViewers,
                        User = group.FirstOrDefault()?.User,
                        Stories = userStories
                    });

                } else
                {
                    var block = await _unitOfWork.BlockListRepository
                        .GetBlockListByUserIdAndUserIdAsync(group.Key, userId);

                    if (block != null) continue;

                    var friendShip = await _unitOfWork.FriendShipRepository
                               .GetFriendShipByUserIdAndFriendIdAsync(userId, group.Key);

                    var takeStories = new List<StoryResponse>();
                    foreach (var story in userStories)
                    {
                        if(story.Privacy == PrivacyConstant.PRIVATE) continue;

                        if (story.Privacy == PrivacyConstant.FRIENDS)
                        {
                            if (friendShip == null || friendShip.Status != FriendShipStatus.ACCEPTED)
                            {
                                continue;
                            }
                        }

                        if (friendShip == null || !friendShip.IsConnect)
                        {
                            story.User.IsShowStatus = false;
                            story.User.IsOnline = false;
                        }

                        takeStories.Add(story);
                    }

                    if (takeStories.Count == 0) continue;

                    bool haveSeen = false;
                    foreach (var story in takeStories)
                    {
                        haveSeen = await _unitOfWork.ViewerRepository.IsAnViewersByStoryIdAndUserIdAsync(story.Id, userId);
                        if (!haveSeen) break;
                    }

                    var mapUser = group.FirstOrDefault()?.User;
                    if (mapUser == null) throw new AppException("Có lỗi xảy ra. Vui lòng thử lại");

                    if (friendShip == null || !friendShip.IsConnect)
                    {
                        mapUser.IsShowStatus = false;
                        mapUser.IsOnline = false;
                    }

                    response.Add(new UserStoryResponse
                    {
                        HaveSeen = haveSeen,
                        User = group.FirstOrDefault()?.User,
                        Stories = takeStories
                    });
                }
            }

            return new DataResponse<List<UserStoryResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy tất cả tin thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
