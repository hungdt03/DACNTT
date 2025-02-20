
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Story.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.StoryInfo;
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class GetStoriesByUserIdHandler : IRequestHandler<GetStoriesByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetStoriesByUserIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetStoriesByUserIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new AppException("Không tìm thấy thông tin người dùng");

            var stories = await _unitOfWork.StoryRepository.GetAllStoriesByUserIdAsync(request.UserId);
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var block = await _unitOfWork.BlockListRepository
                       .GetBlockListByUserIdAndUserIdAsync(request.UserId, userId);

            if (block != null) throw new NotFoundException("Bạn không thể xem tin của người này");

            var mapUser = ApplicationMapper.MapToUser(user);
            var takeStories = new List<Domain.Entity.StoryInfo.Story>();
            Domain.Entity.UserInfo.FriendShip? friendShip = null;
          
            if (userId == request.UserId)
            {
                takeStories = [.. stories];
            } else
            {
               friendShip = await _unitOfWork.FriendShipRepository
                    .GetFriendShipByUserIdAndFriendIdAsync(user.Id, userId);

                foreach (var story in stories)
                {
                    if (story.Privacy == PrivacyConstant.PRIVATE) continue;

                    if (story.Privacy == PrivacyConstant.FRIENDS)
                    {
                        
                        if (friendShip == null || friendShip.Status != FriendShipStatus.ACCEPTED)
                        {
                            continue;
                        }
                    }

                    takeStories.Add(story);
                }

                if (friendShip == null || !friendShip.IsConnect)
                {
                    mapUser.IsShowStatus = false;
                    mapUser.IsOnline = false;
                }
            }

            if (takeStories.Count == 0) throw new AppException("Người này không có tin nào");

            var mapStories = new List<StoryResponse>();
            bool haveSeen = true;
            foreach (var story in takeStories)
            {
                var storyItem = ApplicationMapper.MapToStory(story);

                if(userId != request.UserId)
                {

                    if (friendShip == null || !friendShip.IsConnect)
                    {
                        storyItem.User.IsShowStatus = false;
                        storyItem.User.IsOnline = false;
                    }
                   
                }
             
                mapStories.Add(storyItem);

                haveSeen = await _unitOfWork.ViewerRepository.IsAnViewersByStoryIdAndUserIdAsync(story.Id, userId);
                if (!haveSeen)
                {
                    haveSeen = false;
                }
            }

            var userStoryResponse = new UserStoryResponse()
            {
                HaveSeen = haveSeen,
                Stories = mapStories,
                User = mapUser
            };

            return new DataResponse<UserStoryResponse>()
            {
                Data = userStoryResponse,
                IsSuccess = true,
                Message = "Lấy dữ liệu tin của user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
