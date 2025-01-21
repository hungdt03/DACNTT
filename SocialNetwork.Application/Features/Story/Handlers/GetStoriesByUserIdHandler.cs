
using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Story.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class GetStoriesByUserIdHandler : IRequestHandler<GetStoriesByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.User> _userManager;

        public GetStoriesByUserIdHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(GetStoriesByUserIdQuery request, CancellationToken cancellationToken)
        {
            var stories = await _unitOfWork.StoryRepository.GetAllStoriesByUserIdAsync(request.UserId);
            var user = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new AppException("Không tìm thấy thông tin người dùng");

            var userStoryResponse = new UserStoryResponse()
            {
                HaveSeen = false,
                Stories = stories.Select(st => ApplicationMapper.MapToStory(st)).ToList(),
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
