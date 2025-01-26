
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
    public class ModifyUserHometownHandler : IRequestHandler<ModifyUserHometownCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ModifyUserHometownHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(ModifyUserHometownCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var user = await _unitOfWork.UserRepository.GetUserByIdAsync(userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");


            Domain.Entity.System.Location? hometown;
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            if (request.LocationId.HasValue)
            {
                hometown = await _unitOfWork.LocationRepository.GetLocationByIdAsync(request.LocationId.Value);
                user.HometownId = hometown.Id;
            }
            else
            {
                var checkExistedHometown = await _unitOfWork.LocationRepository.GetLocationByNameAsync(request.Address);

                if (checkExistedHometown != null)
                {
                    user.HometownId = checkExistedHometown.Id;
                }
                else
                {
                    hometown = new Domain.Entity.System.Location()
                    {
                        Address = request.Address,
                    };

                    await _unitOfWork.LocationRepository.CreateLocationAsync(hometown);

                    user.HometownId = hometown.Id;
                }
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật thông tin quê quán của người dùng thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
