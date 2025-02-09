

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetPostVideosByCurrentUserHandler : IRequestHandler<GetPostVideosByCurrentUserQuery, BaseResponse>
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetPostVideosByCurrentUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetPostVideosByCurrentUserQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var (postVideos, totalCount) = await _unitOfWork.PostMediaRepository
                .GetAllPostVideosByUserId(userId, request.Page, request.Size);

            var response = postVideos.Select(ApplicationMapper.MapToPostMedia).ToList();

            return new PaginationResponse<List<MediaResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy dữ liệu videos thành công",
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size
                }
            };
        }
    }
}
