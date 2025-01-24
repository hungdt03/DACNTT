
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Story.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Story.Handlers
{
    public class ModifyBioHandler : IRequestHandler<ModifyBioCommand, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.System.User> userManager;
        private readonly IHttpContextAccessor httpContextAccessor;

        public ModifyBioHandler(UserManager<Domain.Entity.System.User> userManager, IHttpContextAccessor contextAccessor)
        {
            this.userManager = userManager;
            this.httpContextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ModifyBioCommand request, CancellationToken cancellationToken)
        {
            var userId = httpContextAccessor.HttpContext.User.GetUserId();

            var user = await userManager.FindByIdAsync(userId)
              ?? throw new NotFoundException("Không tìm thấy thông tin user");

            user.Bio = request.Bio;

            var modifyResult = await userManager.UpdateAsync(user);
            if (!modifyResult.Succeeded)
                throw new AppException("Cập nhật tiểu sử thất bại");

            return new DataResponse<string>()
            {
                IsSuccess = true,
                Data = request.Bio,
                Message = "Cập nhật thông tin tiểu sử thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
