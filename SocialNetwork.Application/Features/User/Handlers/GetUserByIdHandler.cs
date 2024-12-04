
using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.User> userManager;

        public GetUserByIdHandler(UserManager<Domain.Entity.User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<BaseResponse> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByIdAsync(request.UserId)
                ?? throw new AppException("Thông tin user không tồn tại");

            var response = ApplicationMapper.MapToUser(user);

            return new DataResponse<UserResponse>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
