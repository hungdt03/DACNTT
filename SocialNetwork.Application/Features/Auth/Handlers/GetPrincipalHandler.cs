using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Queries;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class GetPrincipalHandler : IRequestHandler<GetPrincipalQuery, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.User> userManager;
        private readonly IHttpContextAccessor contextAccessor;

        public GetPrincipalHandler(UserManager<Domain.Entity.User> userManager, IHttpContextAccessor contextAccessor)
        {
            this.userManager = userManager;
            this.contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetPrincipalQuery request, CancellationToken cancellationToken)
        {
            var userId = contextAccessor.HttpContext.User.GetUserId();
            var user = await userManager.FindByIdAsync(userId)
                ?? throw new AppException("Không tìm thấy thông tin user");

            var response = ApplicationMapper.MapToUser(user);

            return new DataResponse<UserResponse>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
