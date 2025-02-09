
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
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetPostImagesByUserIdHandler : IRequestHandler<GetPostImagesByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetPostImagesByUserIdHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.System.User> userManager, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetPostImagesByUserIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new NotFoundException("ID người dùng không đúng");

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var friendShip = await _unitOfWork.FriendShipRepository
                .GetFriendShipByUserIdAndFriendIdAsync(userId, user.Id, FriendShipStatus.ACCEPTED);

            List<PostMedia> postImages = null;
            int totalCount = 0;

            if(friendShip != null)
            {
                (postImages, totalCount) = await _unitOfWork.PostMediaRepository
                    .GetPublicAndFriendPostImagesByUserId(request.UserId, request.Page, request.Size);
            } else
            {
                (postImages, totalCount) = await _unitOfWork.PostMediaRepository
                    .GetPublicPostImagesByUserId(request.UserId, request.Page, request.Size);
            }

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
