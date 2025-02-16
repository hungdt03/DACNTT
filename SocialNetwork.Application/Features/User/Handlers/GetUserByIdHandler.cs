
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.System.User> userManager;
        private readonly IUnitOfWork unitOfWork;
        private readonly IHttpContextAccessor httpContextAccessor;

        public GetUserByIdHandler(IHttpContextAccessor httpContextAccessor, UserManager<Domain.Entity.System.User> userManager, IUnitOfWork unitOfWork)
        {
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
            this.httpContextAccessor = httpContextAccessor;
        }

        public async Task<BaseResponse> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await unitOfWork.UserRepository.GetUserByIdAsync(request.UserId)
                ?? throw new AppException("Thông tin user không tồn tại");

            var response = ApplicationMapper.MapToUser(user);
            response.FriendCount = await unitOfWork.FriendShipRepository.CountFriendsByUserIdAsync(request.UserId);
            response.FollowerCount = await unitOfWork.FollowRepository.CountFollowersByUserIdAsync(request.UserId);
            response.FollowingCount = await unitOfWork.FollowRepository.CountFolloweesByUserIdAsync(request.UserId);
            var haveStory = await unitOfWork.StoryRepository
                   .IsUserHaveStoryAsync(user.Id);
            response.HaveStory = haveStory;

            var roles = await userManager.GetRolesAsync(user);
            if (roles != null && roles.Count > 0)
                response.Role = roles[0];

            return new DataResponse<UserResponse>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
