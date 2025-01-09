
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Story.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

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
            var response = stories.Select(ApplicationMapper.MapToStory).ToList()
                 .GroupBy(x => x.User.Id)
                 .Select(x => new UserStoryResponse()
                 {
                     User = x.FirstOrDefault()?.User,
                     Stories = x.ToList()
                 }).ToList();

            return new DataResponse<List<UserStoryResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy tất cả tin thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
