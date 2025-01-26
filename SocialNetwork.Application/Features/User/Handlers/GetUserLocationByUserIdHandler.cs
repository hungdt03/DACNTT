

using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetUserLocationByUserIdHandler : IRequestHandler<GetUserLocationByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public GetUserLocationByUserIdHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(GetUserLocationByUserIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new AppException("Thông tin user không tồn tại");

            if (!user.LocationId.HasValue)
                throw new NotFoundException("Người dùng chưa cập nhật thông tin nơi sống hiện tại");

            var location = await _unitOfWork.LocationRepository.GetLocationByIdAsync(user.LocationId.Value)
                ?? throw new NotFoundException("Thông tin nơi sống không tồn tại");


            return new DataResponse<Domain.Entity.System.Location>
            {
                Data = location,
                IsSuccess = true,
                Message = "Lấy thông tin nơi sống người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
