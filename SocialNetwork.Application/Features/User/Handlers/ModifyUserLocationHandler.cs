
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class ModifyUserLocationHandler : IRequestHandler<ModifyUserLocationCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ModifyUserLocationHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(ModifyUserLocationCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");


            Domain.Entity.System.Location? location; 
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            if(request.LocationId.HasValue)
            {
                location = await _unitOfWork.LocationRepository.GetLocationByIdAsync(request.LocationId.Value);
                user.LocationId = location.Id;
            } else
            {
                var checkExistedLocation = await _unitOfWork.LocationRepository.GetLocationByNameAsync(request.Address);
                
                if(checkExistedLocation != null)
                {
                    user.LocationId = checkExistedLocation.Id;
                } else
                {
                    location = new Domain.Entity.System.Location()
                    {
                        Address = request.Address,
                    };

                    await _unitOfWork.LocationRepository.CreateLocationAsync(location);

                    user.LocationId = location.Id;
                }
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);
            
            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật thông tin địa điểm của người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
