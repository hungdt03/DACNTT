
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.BlockList.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.BlockList.Handlers
{
    public class GetAllBlockUsersHandler : IRequestHandler<GetAllBlockUsersQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllBlockUsersHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllBlockUsersQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (blockLists, totalCount) = await _unitOfWork.BlockListRepository
                .GetAllBlocksByUserIdAsync(userId, request.Page, request.Size);

            var response = new List<UserResponse>();

            foreach(var block in blockLists)
            {
                var responseItem = ApplicationMapper.MapToUser(block.Blockee);
                var haveStory = await _unitOfWork.StoryRepository.IsUserHaveStoryAsync(block.BlockeeId);
                responseItem.HaveStory = haveStory;
                response.Add(responseItem);
            }

            return new PaginationResponse<List<UserResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách chặn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Size = request.Size,
                    Page = request.Page,
                }
            };
        }
    }
}
