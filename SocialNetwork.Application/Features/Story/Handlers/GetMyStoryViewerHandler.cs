
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Story.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class GetMyStoryViewerHandler : IRequestHandler<GetMyStoryViewerQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetMyStoryViewerHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetMyStoryViewerQuery request, CancellationToken cancellationToken)
        {
            var story = await _unitOfWork.StoryRepository.GetStoryByIdAsync(request.StoryId)
               ?? throw new NotFoundException("Tin không tồn tại");

            if (story.ExpiresAt < DateTimeOffset.UtcNow)
                throw new AppException("Tin không còn nữa");

            var viewers = await _unitOfWork.ViewerRepository.GetAllViewerByStoryIdAsync(story.Id);
            var groupUserView = viewers.GroupBy(v => v.UserId)
                .Select(v =>
                {
                    var reactions = v.ToList().Where(r => r.Reaction != null).Select(r => r.Reaction).ToList() ?? new();
                    var viewer = v.ToList().FirstOrDefault();

                    return ApplicationMapper.MapToViewerResponse(viewer, reactions);
                })
                .ToList();
           
            return new DataResponse<List<ViewerResponse>>()
            {
                Data = groupUserView,
                IsSuccess = true,
                Message = "Lấy tin của bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
