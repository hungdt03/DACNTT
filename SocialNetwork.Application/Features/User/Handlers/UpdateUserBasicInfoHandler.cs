

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class UpdateUserBasicInfoHandler : IRequestHandler<UpdateUserBasicInfoCommand, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public UpdateUserBasicInfoHandler(UserManager<Domain.Entity.System.User> userManager, IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(UpdateUserBasicInfoCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");


            if(string.IsNullOrEmpty(request.Gender) && request.Gender != "FEMALE" && request.Gender != "MALE" && request.Gender != "OTHER")
            {
                throw new AppException("Giới tính không hợp lệ");
            }

            user.FullName = request.FullName;
            user.DateOfBirth = request.Birthday;
            user.Gender = request.Gender;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
                throw new AppException("Cập nhật thông tin cá nhân thất bại");

            var response = ApplicationMapper.MapToUser(user);
            response.FriendCount = await _unitOfWork.FriendShipRepository.CountFriendsByUserIdAsync(user.Id);
            response.FollowerCount = await _unitOfWork.FollowRepository.CountFollowersByUserIdAsync(user.Id);
            response.FollowingCount = await _unitOfWork.FollowRepository.CountFolloweesByUserIdAsync(user.Id);
            var haveStory = await _unitOfWork.StoryRepository
                   .IsUserHaveStoryAsync(user.Id);
            response.HaveStory = haveStory;
            return new DataResponse<UserResponse>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Cập nhật thông tin user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
