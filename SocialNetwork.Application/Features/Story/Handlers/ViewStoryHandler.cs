

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Story.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class ViewStoryHandler : IRequestHandler<ViewStoryCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ViewStoryHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(ViewStoryCommand request, CancellationToken cancellationToken)
        {
            var story = await _unitOfWork.StoryRepository.GetStoryByIdAsync(request.StoryId)
                ?? throw new NotFoundException("Tin không tồn tại");

            if (story.ExpiresAt < DateTimeOffset.UtcNow)
                throw new AppException("Tin không còn nữa");

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            if (userId == story.UserId) throw new AppException("Không thể xem story của chính mình");
            
            var isExistedViewer = await _unitOfWork.ViewerRepository.IsViewerExisted(userId, request.StoryId);

            if (isExistedViewer) throw new AppException("Tin này đã được xem trước đó");

            var viewer = new Domain.Entity.StoryInfo.Viewer()
            {
                StoryId = request.StoryId,
                UserId = userId,
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.ViewerRepository.CreateViewerAsync(viewer);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xem tin thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
