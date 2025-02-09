
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetPostImagesByCurrentUserHandler : IRequestHandler<GetPostImagesByCurrentUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetPostImagesByCurrentUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetPostImagesByCurrentUserQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var (postImages, totalCount) = await _unitOfWork.PostMediaRepository
                .GetAllPostImagesByUserId(userId, request.Page, request.Size);

            var response = postImages.Select(ApplicationMapper.MapToPostMedia).ToList();

            return new PaginationResponse<List<MediaResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy dữ liệu hình ảnh thành công",
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
