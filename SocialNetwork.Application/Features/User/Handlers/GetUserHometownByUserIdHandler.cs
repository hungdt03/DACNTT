

using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetUserHometownByUserIdHandler : IRequestHandler<GetUserHometownByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public GetUserHometownByUserIdHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(GetUserHometownByUserIdQuery request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new AppException("Thông tin user không tồn tại");

            if (!user.HometownId.HasValue)
                throw new NotFoundException("Người dùng chưa cập nhật thông tin quê quán");

            var location = await _unitOfWork.LocationRepository.GetLocationByIdAsync(user.HometownId.Value)
                ?? throw new NotFoundException("Thông tin quê quán không tồn tại");


            return new DataResponse<Domain.Entity.System.Location>
            {
                Data = location,
                IsSuccess = true,
                Message = "Lấy thông tin quê quán người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
