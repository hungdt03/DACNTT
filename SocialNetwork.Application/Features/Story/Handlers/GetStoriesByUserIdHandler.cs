
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

            var takeStories = new List<Domain.Entity.StoryInfo.Story>();

            if(userId == request.UserId)
            {
                takeStories = [.. stories];
            } else
            {
                foreach (var story in stories)
                {
                    if (story.Privacy == PrivacyConstant.PRIVATE) continue;

                    if (story.Privacy == PrivacyConstant.FRIENDS)
                    {
                        var friendShip = await _unitOfWork.FriendShipRepository
                            .GetFriendShipByUserIdAndFriendIdAsync(story.User.Id, userId, FriendShipStatus.ACCEPTED);

                        if (friendShip == null)
                        {
                            continue;
                        }
                    }

                    takeStories.Add(story);
                }

            }

            if (!takeStories.Any()) throw new AppException("Người này không có tin nào");

            bool haveSeen = false;
            foreach (var story in takeStories)
            {
                haveSeen = await _unitOfWork.ViewerRepository.IsAnViewersByStoryIdAndUserIdAsync(story.Id, userId);
                if (!haveSeen) break;
            }

            var userStoryResponse = new UserStoryResponse()
            {
                HaveSeen = false,
                Stories = takeStories.Select(st => ApplicationMapper.MapToStory(st)).ToList(),
                User = ApplicationMapper.MapToUser(user)
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
