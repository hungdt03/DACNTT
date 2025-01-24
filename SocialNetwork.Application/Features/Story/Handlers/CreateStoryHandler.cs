using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Story.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class CreateStoryHandler : IRequestHandler<CreateStoryCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly IHttpContextAccessor _contextAccessor;

        public CreateStoryHandler(IUnitOfWork unitOfWork, ICloudinaryService cloudinaryService, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _cloudinaryService = cloudinaryService;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(CreateStoryCommand request, CancellationToken cancellationToken)
        {
            var story = new Domain.Entity.StoryInfo.Story()
            {
                Background = request.Background,
                Content = request.Content,
                ExpiresAt = DateTimeOffset.UtcNow.AddDays(1),
                FontFamily = request.FontFamily,
                Type = request.Type,
                Privacy = request.Privacy,
                UserId = _contextAccessor.HttpContext.User.GetUserId(),
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.StoryRepository.CreateStoryAsync(story);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Tạo tin thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
